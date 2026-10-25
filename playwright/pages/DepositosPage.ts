import { expect, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

// Id que no existe en la sandbox (mismo valor que depositoInexistenteId en la colección Postman del grupo).
const NONEXISTENT_DEPOSIT_ID = 999999;

export class DepositosPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async signInAsAdmin(email: string): Promise<void> {
    await this.page.goto('/');
    await this.page.getByRole('radio', { name: /Curso 2/ }).check();
    await this.page.getByRole('button', { name: 'Continuar' }).click();
    await this.page.getByLabel('Email').fill(email);
    await this.page.getByRole('button', { name: 'Ingresar' }).click();
    await expect(this.page.getByRole('heading', { name: /Bienvenido/ })).toBeVisible();
  }

  async openDepositsList(): Promise<void> {
    await this.page.getByTestId('nav-item-v2-depositos').click();
    await expect(this.page.getByRole('heading', { name: 'Depósitos a plazo' })).toBeVisible();
  }

  /** Abre el formulario de constitución solo para leerlo; nunca se envía. */
  async openNewDepositForm(): Promise<void> {
    await this.page.getByTestId('v2-depositos-nuevo').click();
    await expect(this.page.getByTestId('v2-depositos-form')).toBeVisible();
  }

  async openDepositById(id: number = NONEXISTENT_DEPOSIT_ID): Promise<void> {
    await this.page.goto(`/v2/depositos/${id}`);
  }

  async filterByStatus(status: string): Promise<void> {
    await this.page.getByTestId('v2-depositos-field-estado').selectOption({ label: status });
  }

  private rows() {
    return this.page.locator('[data-testid^="v2-depositos-row-"]');
  }

  async expectActiveDepositsListed(): Promise<void> {
    await this.filterByStatus('Activo');
    await expect(this.rows().first()).toBeVisible();
  }

  async expectRowsShowAmountRateAndMaturity(): Promise<void> {
    const rows = this.rows();
    const total = await rows.count();
    expect(total).toBeGreaterThan(0);
    for (let i = 0; i < total; i++) {
      const row = rows.nth(i);
      await expect(row).toContainText(/PYG\s[\d.]+,\d{2}/);
      await expect(row).toContainText(/\d+,\d{2}\s%/);
      await expect(row).toContainText(/\d{2}\/\d{2}\/\d{4}/);
      await expect(row).toContainText('Activo');
    }
  }

  async expectMinimumAmountShown(): Promise<void> {
    await expect(this.page.getByTestId('v2-depositos-field-monto-hint')).toContainText(/Mínimo PYG\s[\d.]+,\d{2}/);
  }

  async expectTermsWithSuggestedRates(): Promise<void> {
    const term = this.page.getByTestId('v2-depositos-field-plazoDias');
    const rate = this.page.getByTestId('v2-depositos-field-tasaAnual');
    const labels = await term.locator('option').allInnerTexts();
    expect(labels.length).toBeGreaterThan(0);
    for (const label of labels) {
      await term.selectOption({ label });
      await expect(rate, `tasa sugerida para ${label}`).toHaveValue(/^\d+(\.\d+)?$/);
    }
  }

  async expectDepositNotFound(): Promise<void> {
    await expect(this.page.getByText('Depósito no encontrado.')).toBeVisible();
  }
}
