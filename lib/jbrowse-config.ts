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