export interface ISeries {
  title: string,
  description: string,
  tags: number[],
  md_id: number,
  mu_id: number | null,
  mal_id: number | null,
  language: TLanguage,
  status: TPublicationStatus,
  notes: string | null,
  author: string[],
  artist: string[]
}

export interface IMetadata {
  id: number,
  title: string,
  description: string,
  author: string[],
  artist: string[],
  tags: number[],

  publication: IPublication,
  relations: IRelation[],
  altTitles: string[],
  links: ILinks
}

export interface IRelation { // structure from MD
  id: number,
  title: string,
  type: number
}

export interface ILinks {
  mu: string,
  mal: string
}

export interface IPublication { // structure from MD
  language: TLanguage
  status: number
}

export interface ISearchOutput {
  title: string,
  description: string,
  id: number
}

export type TLanguage = 'jp' | 'gb' | 'cn' | 'kr' | '';
export type TPublicationStatus = 'Ongoing' | 'Complete' | 'Hiatus' | 'Cancelled' | '';
