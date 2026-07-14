export const DB2_ASSEMBLY = {
  name: "Otau_3.2",
  sequence: {
    type: "ReferenceSequenceTrack",
    trackId: "otau-reference",
    adapter: {
      type: "BgzipFastaAdapter",
      fastaLocation: { uri: "https://pub-00f0cdc6e97c4fc597b52927f437c27f.r2.dev/Otau3.2.fasta.gz" },
      faiLocation:  { uri: "https://pub-00f0cdc6e97c4fc597b52927f437c27f.r2.dev/Otau3.2.fasta.gz.fai" },
      gziLocation:  { uri: "https://pub-00f0cdc6e97c4fc597b52927f437c27f.r2.dev/Otau3.2.fasta.gz.gzi" },
    },
  },
}

export const SPECIES_LIST = [
  {
    id: "otaurus",
    scientificName: "Onthophagus taurus",
    commonName: "Bull-headed dung beetle",
    genomeSize: "~295 Mb",
    chromosomes: 12,
    assemblyName: "Otau_3.2",
  },
  {
    id: "osagittarius",
    scientificName: "Onthophagus sagittarius",
    commonName: "Sagittarius dung beetle",
    genomeSize: "~561 Mb",
    chromosomes: null,
    assemblyName: "Osag_1.3",
  },
  {
    id: "dgazella",
    scientificName: "Digitonthophagus gazella",
    commonName: "Gazelle dung beetle",
    genomeSize: "~346 Mb",
    chromosomes: null,
    assemblyName: "Dgaz_1.3",
  },
  {
    id: "obinodis",
    scientificName: "Onthophagus binodis",
    commonName: "Two-knobbed dung beetle",
    genomeSize: "~843 Mb",
    chromosomes: null,
    assemblyName: "Obin_1.0",
  },
]

export const DB2_TRACKS = [
  {
    type: "FeatureTrack",
    trackId: "ncbi-annotations",
    name: "NCBI Gene Annotation",
    assemblyNames: ["Otau_3.2"],
    adapter: {
      type: "Gff3TabixAdapter",
      gffGzLocation: { uri: "https://pub-00f0cdc6e97c4fc597b52927f437c27f.r2.dev/Ot3_3.2Chrs.sorted.gff3.gz" },
      index: { location: { uri: "https://pub-00f0cdc6e97c4fc597b52927f437c27f.r2.dev/Ot3_3.2Chrs.sorted.gff3.gz.tbi" } },
    },
  },
  {
    type: "FeatureTrack",
    trackId: "gtf-annotations",
    name: "GTF Annotation",
    assemblyNames: ["Otau_3.2"],
    adapter: {
      type: "Gff3TabixAdapter",
      gffGzLocation: { uri: "https://pub-00f0cdc6e97c4fc597b52927f437c27f.r2.dev/Ot3_3.2Chrs.sorted.gtf.gz" },
      index: { location: { uri: "https://pub-00f0cdc6e97c4fc597b52927f437c27f.r2.dev/Ot3_3.2Chrs.sorted.gtf.gz.tbi" } },
    },
  },
]

export const SPECIES_CONFIGS: Record<string, { assembly: object; tracks: object[] }> = {
  otaurus: {
    assembly: DB2_ASSEMBLY,
    tracks: DB2_TRACKS,
  },
  osagittarius: {
    assembly: {
      name: "Osag_1.3",
      sequence: {
        type: "ReferenceSequenceTrack",
        trackId: "osag-reference",
        adapter: {
          type: "BgzipFastaAdapter",
          fastaLocation: { uri: "https://pub-00f0cdc6e97c4fc597b52927f437c27f.r2.dev/osagittarius/Osag1.3.fasta.gz" },
          faiLocation:  { uri: "https://pub-00f0cdc6e97c4fc597b52927f437c27f.r2.dev/osagittarius/Osag1.3.fasta.gz.fai" },
          gziLocation:  { uri: "https://pub-00f0cdc6e97c4fc597b52927f437c27f.r2.dev/osagittarius/Osag1.3.fasta.gz.gzi" },
        },
      },
    },
    tracks: [
      {
        type: "FeatureTrack",
        trackId: "osag-gtf",
        name: "Gene Annotation (AUGUSTUS)",
        assemblyNames: ["Osag_1.3"],
        adapter: {
          type: "Gff3TabixAdapter",
          gffGzLocation: { uri: "https://pub-00f0cdc6e97c4fc597b52927f437c27f.r2.dev/osagittarius/Osag1.3.sorted.gtf.gz" },
          index: { location: { uri: "https://pub-00f0cdc6e97c4fc597b52927f437c27f.r2.dev/osagittarius/Osag1.3.sorted.gtf.gz.tbi" } },
        },
      },
    ],
  },
  dgazella: {
    assembly: {
      name: "Dgaz_1.3",
      sequence: {
        type: "ReferenceSequenceTrack",
        trackId: "dgaz-reference",
        adapter: {
          type: "BgzipFastaAdapter",
          fastaLocation: { uri: "https://pub-00f0cdc6e97c4fc597b52927f437c27f.r2.dev/dgazella/Dgaz1.3.fasta.gz" },
          faiLocation:  { uri: "https://pub-00f0cdc6e97c4fc597b52927f437c27f.r2.dev/dgazella/Dgaz1.3.fasta.gz.fai" },
          gziLocation:  { uri: "https://pub-00f0cdc6e97c4fc597b52927f437c27f.r2.dev/dgazella/Dgaz1.3.fasta.gz.gzi" },
        },
      },
    },
    tracks: [
      {
        type: "FeatureTrack",
        trackId: "dgaz-gtf",
        name: "Gene Annotation (AUGUSTUS)",
        assemblyNames: ["Dgaz_1.3"],
        adapter: {
          type: "Gff3TabixAdapter",
          gffGzLocation: { uri: "https://pub-00f0cdc6e97c4fc597b52927f437c27f.r2.dev/dgazella/Dgaz1.3.sorted.gtf.gz" },
          index: { location: { uri: "https://pub-00f0cdc6e97c4fc597b52927f437c27f.r2.dev/dgazella/Dgaz1.3.sorted.gtf.gz.tbi" } },
        },
      },
    ],
  },
  obinodis: {
    assembly: {
      name: "Obin_1.0",
      sequence: {
        type: "ReferenceSequenceTrack",
        trackId: "obin-reference",
        adapter: {
          type: "BgzipFastaAdapter",
          fastaLocation: { uri: "https://pub-00f0cdc6e97c4fc597b52927f437c27f.r2.dev/obinodis/Obin1.0.fasta.gz" },
          faiLocation:  { uri: "https://pub-00f0cdc6e97c4fc597b52927f437c27f.r2.dev/obinodis/Obin1.0.fasta.gz.fai" },
          gziLocation:  { uri: "https://pub-00f0cdc6e97c4fc597b52927f437c27f.r2.dev/obinodis/Obin1.0.fasta.gz.gzi" },
        },
      },
    },
    tracks: [
      {
        type: "FeatureTrack",
        trackId: "obin-gtf",
        name: "Gene Annotation (AUGUSTUS)",
        assemblyNames: ["Obin_1.0"],
        adapter: {
          type: "Gff3TabixAdapter",
          gffGzLocation: { uri: "https://pub-00f0cdc6e97c4fc597b52927f437c27f.r2.dev/obinodis/Obin1.0.sorted.gtf.gz" },
          index: { location: { uri: "https://pub-00f0cdc6e97c4fc597b52927f437c27f.r2.dev/obinodis/Obin1.0.sorted.gtf.gz.tbi" } },
        },
      },
    ],
  },
}