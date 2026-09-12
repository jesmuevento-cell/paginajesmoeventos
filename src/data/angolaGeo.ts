/**
 * Divisão Político-Administrativa de Angola (18 Províncias e Municípios Oficiais)
 * THE VOICE LUNDA-SUL / CANASI OFICIAL aceita candidatos de todo o território nacional.
 */

export interface AngolaProvince {
  nome: string;
  capital: string;
  municipios: string[];
}

export const PROVINCIAS_ANGOLA: AngolaProvince[] = [
  {
    nome: 'Lunda-Sul',
    capital: 'Saurimo',
    municipios: ['Saurimo', 'Cacolo', 'Dala', 'Muconda'],
  },
  {
    nome: 'Luanda',
    capital: 'Luanda',
    municipios: [
      'Luanda',
      'Belas',
      'Cacuaco',
      'Cazenga',
      'Icolo e Bengo',
      'Kilamba Kiaxi',
      'Quissama',
      'Talatona',
      'Viana',
    ],
  },
  {
    nome: 'Benguela',
    capital: 'Benguela',
    municipios: [
      'Benguela',
      'Baía Farta',
      'Balombo',
      'Bocoio',
      'Caimbambo',
      'Catumbela',
      'Chongoroi',
      'Cubal',
      'Ganda',
      'Lobito',
    ],
  },
  {
    nome: 'Huambo',
    capital: 'Huambo',
    municipios: [
      'Huambo',
      'Bailundo',
      'Caála',
      'Catchiungo',
      'Chicala-Cholohanga',
      'Chinjenje',
      'Ecunha',
      'Londuimbali',
      'Longonjo',
      'Mungo',
      'Ucuma',
    ],
  },
  {
    nome: 'Huíla',
    capital: 'Lubango',
    municipios: [
      'Lubango',
      'Caconda',
      'Caluquembe',
      'Chiange',
      'Chibia',
      'Chicomba',
      'Chipindo',
      'Cuvango',
      'Humpata',
      'Jamba',
      'Matala',
      'Quilengues',
      'Quipungo',
    ],
  },
  {
    nome: 'Lunda-Norte',
    capital: 'Dundo',
    municipios: [
      'Chitato (Dundo)',
      'Cambulo',
      'Capenda-Camulemba',
      'Caungula',
      'Cuango',
      'Cuílo',
      'Lóvua',
      'Lubalo',
      'Lucapa',
      'Xá-Muteba',
    ],
  },
  {
    nome: 'Malanje',
    capital: 'Malanje',
    municipios: [
      'Malanje',
      'Cacuso',
      'Calandula',
      'Cambundi-Catembo',
      'Cangandala',
      'Caombo',
      'Cuaba Nzogo',
      'Cunda-dia-Baze',
      'Luquembo',
      'Marimba',
      'Massango',
      'Mucari',
      'Quela',
      'Quirima',
    ],
  },
  {
    nome: 'Moxico',
    capital: 'Luena',
    municipios: [
      'Moxico (Luena)',
      'Alto Zambeze',
      'Bundas',
      'Camanongue',
      'Cameia',
      'Léua',
      'Luacano',
      'Luau',
      'Luchazes',
    ],
  },
  {
    nome: 'Bié',
    capital: 'Cuito',
    municipios: [
      'Cuito',
      'Andulo',
      'Camacupa',
      'Catabola',
      'Chinguar',
      'Chitembo',
      'Cuemba',
      'Cunhinga',
      'Nharea',
    ],
  },
  {
    nome: 'Cabinda',
    capital: 'Cabinda',
    municipios: ['Cabinda', 'Belize', 'Buco-Zau', 'Cacongo'],
  },
  {
    nome: 'Cuanza Sul',
    capital: 'Sumbe',
    municipios: [
      'Sumbe',
      'Amboim (Gabela)',
      'Cassongue',
      'Cela (Waku Kungo)',
      'Conda',
      'Ebo',
      'Libolo',
      'Mussende',
      'Porto Amboim',
      'Quibala',
      'Quilenda',
      'Seles',
    ],
  },
  {
    nome: 'Cuanza Norte',
    capital: 'Ndalatando',
    municipios: [
      'Cazengo (Ndalatando)',
      'Ambaca',
      'Banga',
      'Bolongongo',
      'Cambambe',
      'Golungo Alto',
      'Gonguembo',
      'Lucala',
      'Quiculungo',
      'Samba Caju',
    ],
  },
  {
    nome: 'Uíge',
    capital: 'Uíge',
    municipios: [
      'Uíge',
      'Ambuíla',
      'Bembe',
      'Buengas',
      'Bungo',
      'Damba',
      'Alto Cauale',
      'Maquela do Zombo',
      'Milunga',
      'Mucaba',
      'Negage',
      'Puri',
      'Quimbele',
      'Quitexe',
      'Santa Cruz',
      'Sanza Pombo',
      'Songo',
    ],
  },
  {
    nome: 'Zaire',
    capital: 'Mbanza Congo',
    municipios: [
      'Mbanza Congo',
      'Cuimba',
      'Nóqui',
      'Nzeto',
      'Soyo',
      'Tomboco',
    ],
  },
  {
    nome: 'Bengo',
    capital: 'Caxito',
    municipios: [
      'Dande (Caxito)',
      'Ambriz',
      'Bula Atumba',
      'Dembos',
      'Nambuangongo',
      'Pango Aluquém',
    ],
  },
  {
    nome: 'Cunene',
    capital: 'Ondjiva',
    municipios: [
      'Cuanhama (Ondjiva)',
      'Cahama',
      'Curoca',
      'Cuvelai',
      'Namacunde',
      'Ombadja',
    ],
  },
  {
    nome: 'Namibe',
    capital: 'Moçâmedes',
    municipios: [
      'Moçâmedes',
      'Bibala',
      'Camucuio',
      'Tômbwa',
      'Virei',
    ],
  },
  {
    nome: 'Cuando Cubango',
    capital: 'Menongue',
    municipios: [
      'Menongue',
      'Calai',
      'Cuangar',
      'Cuchi',
      'Cuito Cuanavale',
      'Dirico',
      'Mavinga',
      'Nancova',
      'Rivungo',
    ],
  },
];

export const LISTA_PROVINCIAS = PROVINCIAS_ANGOLA.map((p) => p.nome);

export function getMunicipiosPorProvincia(provinciaNome: string): string[] {
  const found = PROVINCIAS_ANGOLA.find(
    (p) => p.nome.toLowerCase() === (provinciaNome || '').toLowerCase()
  );
  return found ? found.municipios : ['Saurimo', 'Cacolo', 'Dala', 'Muconda'];
}
