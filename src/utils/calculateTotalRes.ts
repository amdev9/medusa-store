import Decimal from "decimal.js"
export interface ExternalApiResponse {
    result: string,
    documentation: string,
    terms_of_use: string,
    time_last_update_unix: number,
    time_last_update_utc: string,
    time_next_update_unix: number,
    time_next_update_utc: string,
    base_code: string,
    target_code: string,
    conversion_rate: number,
    conversion_result: number
}

export function calculateTotalRes(amount: string, data: ExternalApiResponse): string {
    
    const price = new Decimal(amount);
    const conversion_rate = new Decimal(data.conversion_rate);

    const total = price.times(conversion_rate);
    const totalRes = total.toFixed(2)
    return totalRes;
}