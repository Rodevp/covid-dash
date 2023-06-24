export interface Sheet {
    Admin2: String
    Combined_Key: String
    Country_Region: String
    Province_State: String
    iso2: String
    iso3: String
    FIPS: number
    Lat: number
    Long_: number
    Population: number
    UID: number
    code3: number
}

export interface DateObject {
    date: string | undefined,
    valueDate: number
}

export interface DataParse {
    provinceState: String
    population: number
    deathsByDate: DateObject
}

