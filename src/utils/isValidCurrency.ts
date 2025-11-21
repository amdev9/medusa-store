const validCurrencies = [
    'USD', 'EUR', 'JPY', 'GBP', 'AUD', 'CAD', 'CHF', 'CNY', 'SEK', 'NZD',
    // add more currency codes as needed
];

export function isValidCurrency(name: string) {
    return validCurrencies.includes(name.toUpperCase());
}
