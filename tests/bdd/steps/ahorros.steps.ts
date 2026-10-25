import { Given, Then, When } from '@cucumber/cucumber';
import { LoansWorld } from '../support/loans.world';

const adminEmail = process.env.TEST_ADMIN_EMAIL || 'admin@aiquaa.com';

Given('que el cliente está autenticado', async function (this: LoansWorld) {
  await this.depositos.signInAsAdmin(adminEmail);
});

Given('que el cliente tiene un depósito a plazo vigente', async function (this: LoansWorld) {
  await this.depositos.signInAsAdmin(adminEmail);
  await this.depositos.openDepositsList();
  await this.depositos.expectActiveDepositsListed();
});

Given('que existen opciones de depósitos a plazo disponibles', async function (this: LoansWorld) {
  await this.depositos.signInAsAdmin(adminEmail);
  await this.depositos.openDepositsList();
  await this.depositos.openNewDepositForm();
});

When('consulta el detalle de ese depósito', async function (this: LoansWorld) {
  await this.depositos.filterByStatus('Activo');
});

When('el cliente consulta las tasas vigentes', async function (this: LoansWorld) {
  await this.depositos.expectMinimumAmountShown();
});

When('consulta un depósito a plazo que no existe', async function (this: LoansWorld) {
  await this.depositos.openDepositById();
});

Then('el sistema devuelve el capital, la tasa y la fecha de vencimiento', async function (this: LoansWorld) {
  await this.depositos.expectRowsShowAmountRateAndMaturity();
});

Then('el sistema muestra los importes, plazos y tasas de interés disponibles', async function (this: LoansWorld) {
  await this.depositos.expectTermsWithSuggestedRates();
});

Then('el sistema responde que el depósito no fue encontrado', async function (this: LoansWorld) {
  await this.depositos.expectDepositNotFound();
});
