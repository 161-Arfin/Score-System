export type RegionOption = {
  id: string;
  name: string;
};

const provinceOrderIds = [
  "11",
  "12",
  "16",
  "13",
  "17",
  "14",
  "21",
  "15",
  "18",
  "19",
  "61",
  "64",
  "63",
  "62",
  "65",
  "36",
  "31",
  "32",
  "33",
  "34",
  "35",
  "51",
  "53",
  "52",
  "75",
  "76",
  "72",
  "71",
  "74",
  "73",
  "82",
  "81",
  "91",
  "94",
  "95",
  "96",
  "93",
  "92",
];

const provinceDisplayNames: Record<string, string> = {
  "11": "Nanggroe Aceh Darussalam",
  "12": "Sumatera Utara",
  "16": "Sumatera Selatan",
  "13": "Sumatera Barat",
  "17": "Bengkulu",
  "14": "Riau",
  "21": "Kepulauan Riau",
  "15": "Jambi",
  "18": "Lampung",
  "19": "Bangka Belitung",
  "61": "Kalimantan Barat",
  "64": "Kalimantan Timur",
  "63": "Kalimantan Selatan",
  "62": "Kalimantan Tengah",
  "65": "Kalimantan Utara",
  "36": "Banten",
  "31": "DKI Jakarta",
  "32": "Jawa Barat",
  "33": "Jawa Tengah",
  "34": "Daerah Istimewa Yogyakarta",
  "35": "Jawa Timur",
  "51": "Bali",
  "53": "Nusa Tenggara Timur",
  "52": "Nusa Tenggara Barat",
  "75": "Gorontalo",
  "76": "Sulawesi Barat",
  "72": "Sulawesi Tengah",
  "71": "Sulawesi Utara",
  "74": "Sulawesi Tenggara",
  "73": "Sulawesi Selatan",
  "82": "Maluku Utara",
  "81": "Maluku",
  "91": "Papua Barat",
  "94": "Papua",
  "95": "Papua Tengah",
  "96": "Papua Pegunungan",
  "93": "Papua Selatan",
  "92": "Papua Barat Daya",
};

const fallbackProvinces: RegionOption[] = [
  ...provinceOrderIds.map((id) => ({
    id,
    name: provinceDisplayNames[id] ?? id,
  })),
];

const fallbackRegenciesByProvince: Record<string, RegionOption[]> = {
  "31": [
    { id: "3175", name: "KOTA JAKARTA TIMUR" },
    { id: "3174", name: "KOTA JAKARTA SELATAN" },
  ],
  "32": [
    { id: "3275", name: "KOTA BEKASI" },
    { id: "3276", name: "KOTA DEPOK" },
  ],
  "36": [{ id: "3671", name: "KOTA TANGERANG" }],
};

const fallbackDistrictsByRegency: Record<string, RegionOption[]> = {
  "3175": [{ id: "3175060", name: "CAKUNG" }],
  "3174": [{ id: "3174050", name: "PASAR MINGGU" }],
  "3275": [{ id: "3275030", name: "BEKASI TIMUR" }],
  "3276": [{ id: "3276030", name: "PANCORAN MAS" }],
  "3671": [{ id: "3671030", name: "CIPONDOH" }],
};

function sortRegionOptions(options: RegionOption[]) {
  return [...options].sort((first, second) =>
    first.name.localeCompare(second.name, "id-ID", {
      sensitivity: "base",
    })
  );
}

function toTitleCase(value: string) {
  return value
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function normalizeRegionOptions(options: RegionOption[]) {
  return options.map((option) => ({
    ...option,
    name: toTitleCase(option.name),
  }));
}

function sortProvinceOptions(options: RegionOption[]) {
  return options.map((option) => ({
    ...option,
    name: provinceDisplayNames[option.id] ?? option.name,
  })).sort((first, second) => {
    const firstIndex = provinceOrderIds.indexOf(first.id);
    const secondIndex = provinceOrderIds.indexOf(second.id);

    if (firstIndex === -1 || secondIndex === -1) {
      return first.name.localeCompare(second.name, "id-ID", {
        sensitivity: "base",
      });
    }

    return firstIndex - secondIndex;
  });
}

async function getRegionOptions(
  endpoint: string,
  fallbackOptions: RegionOption[],
  sorter = sortRegionOptions
) {
  try {
    const response = await fetch(`/api/regions/${endpoint}`);

    if (!response.ok) {
      return sorter(fallbackOptions);
    }

    return sorter((await response.json()) as RegionOption[]);
  } catch {
    return sorter(fallbackOptions);
  }
}

export function getProvinceOptions() {
  return getRegionOptions("provinces", fallbackProvinces, sortProvinceOptions);
}

export function getRegencyOptions(provinceId: string) {
  return getRegionOptions(
    `regencies/${provinceId}`,
    fallbackRegenciesByProvince[provinceId] ?? [],
    (options) => sortRegionOptions(normalizeRegionOptions(options))
  );
}

export function getDistrictOptions(regencyId: string) {
  return getRegionOptions(
    `districts/${regencyId}`,
    fallbackDistrictsByRegency[regencyId] ?? [],
    (options) => sortRegionOptions(normalizeRegionOptions(options))
  );
}
