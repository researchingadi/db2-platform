# (DB)² — Dung Beetle Database

<div align="center">

**A modern genome and transcriptomics database for *Onthophagus taurus***

*Davidson Lab · Department of Biological Sciences · Mississippi State University*

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js&logoColor=white)](https://nextjs.org)
[![Assembly](https://img.shields.io/badge/Assembly-GCF__036711975.1-7c3aed)](https://www.ncbi.nlm.nih.gov/assembly/GCF_036711975.1)
[![iNaturalist](https://img.shields.io/badge/iNaturalist-125819-74ac00)](https://www.inaturalist.org/taxa/125819-Scarabaeinae)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/license-MIT-22c55e)](LICENSE)

[**Genome Browser**](#) · [**Distribution Map**](#) · [**Davidson Lab**](https://davidsonlab-msu.github.io/)

</div>

---

## Overview

**(DB)²** is an open, web-based genome and transcriptomics database for the dung beetle *Onthophagus taurus* (Schreber, 1759) — a model organism for studying the genomic basis of developmental plasticity, sexual selection, and horn polyphenism. The platform centralizes the chromosome-level genome assembly (GCF_036711975.1), NCBI and Davidson Lab custom gene annotations, RNA-seq expression datasets, and global biodiversity occurrence data in a single, researcher-friendly interface.

*O. taurus* exhibits striking male-limited horn polyphenism, in which large males develop prominent cephalic horns used in combat for female access while small males remain hornless. This conditional strategy has made the species a powerful system for understanding how genomes encode alternative phenotypes, and (DB)² is designed to support this research by making genome-level data accessible at every level of biological inquiry.

---

## Scientific Background

| Feature | Detail |
|---|---|
| **Species** | *Onthophagus taurus* (Schreber, 1759) |
| **Family** | Scarabaeidae |
| **Subfamily** | Scarabaeinae (dung beetles) |
| **NCBI Taxon ID** | 166361 |
| **Research focus** | Horn polyphenism, sexual selection, developmental plasticity, genome evolution |
| **Native range** | Mediterranean Europe, North Africa, Middle East |
| **Introduced range** | North America, Australia |

---

## Genome Assembly

| Field | Value |
|---|---|
| **Assembly name** | IU_Otau_3.0 |
| **NCBI Accession** | [GCF_036711975.1](https://www.ncbi.nlm.nih.gov/assembly/GCF_036711975.1) |
| **Assembly level** | Chromosome |
| **Chromosomes** | 12 |
| **Genome size** | ~295 Mb |
| **Sequencing** | Long-read (chromosome-level scaffolding) |
| **Primary annotation** | NCBI Annotation Release |
| **Custom annotation** | Davidson Lab v1 |
| **Hosted file format** | bgzipped FASTA + tabix-indexed GFF3/GTF |

---

## Platform Features

### Genome Browser
Powered by [JBrowse 2](https://jbrowse.org/jb2/), embedded as a React component with the chromosome-level assembly and multiple annotation tracks served directly from Cloudflare R2 via HTTP byte-range requests. All genomic data streams client-side on demand — no server processing required.

**Tracks available:**
- Reference sequence (bgzipped FASTA, BgzipFastaAdapter)
- NCBI Gene Annotation Release (GFF3, Gff3TabixAdapter)
- Davidson Lab Custom Annotation v1 (GFF3, Gff3TabixAdapter)
- GTF annotation track (Gff3TabixAdapter)
- RNA-seq tracks *(coming in v2)*

### Global Distribution Map
Interactive biodiversity map built on [Leaflet.js](https://leafletjs.com/) with live data from the [iNaturalist API](https://api.inaturalist.org/v1/docs/). The map dynamically switches between:
- **Low zoom (< 10):** aggregated heatmap grid tiles showing global observation density
- **High zoom (≥ 10):** individual observation markers with real-time API fetching, each displaying species ID, observer, date, quality grade, and photo thumbnail

All occurrence data is sourced live from iNaturalist (Taxon ID: 125819 — Scarabaeinae), covering 122,000+ global observations across 50,000+ observers.

### Gene Search *(v2)*
Filterable, sortable table of 28,456+ predicted gene models with search by gene ID, chromosome, coordinate range, annotation source, and RNA-seq availability.

### Expression Data *(v2)*
RNA-seq datasets linked to biological features including horn development, leg morphology, and developmental stage series.

### Publications
Curated library of Davidson Lab publications and dung beetle genomics literature with DOI links and dataset cross-references.

### Downloads
Direct access to all genomic data files: chromosome-level and scaffold-level FASTA assemblies, GFF3 and GTF annotation files, metadata, and version history.

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Framework | Next.js 14 (App Router) | Full-stack React, SSR/SSG, API routing |
| Language | TypeScript 5 | Type-safe development |
| Styling | Tailwind CSS | Utility-first dark-theme UI |
| Genome browser | JBrowse 2 | Embedded genomic visualization |
| Distribution map | Leaflet.js + iNaturalist API v1 | Biodiversity occurrence mapping |
| File hosting | Cloudflare R2 | Zero-egress genomic file CDN |
| Deployment | Vercel | CI/CD + global edge hosting |

---

## Data Pipeline

All genomic files are preprocessed before deployment to enable efficient byte-range HTTP access in JBrowse.

### Genome FASTA
```bash
# Block-compress with bgzip (required for random access)
bgzip -k Otau3.2.fasta

# Generate FASTA index and bgzip block index
samtools faidx Otau3.2.fasta.gz
# produces: Otau3.2.fasta.gz.fai + Otau3.2.fasta.gz.gzi
```

### Annotation Files (GFF3 / GTF)
```bash
# Sort by chromosome and start position, then block-compress
sort -k1,1 -k4,4n annotations.gff3 | bgzip > annotations.sorted.gff3.gz

# Generate tabix index for coordinate-based random access
tabix -p gff annotations.sorted.gff3.gz
# produces: annotations.sorted.gff3.gz.tbi
```

All processed files and indexes are hosted on Cloudflare R2 with CORS configured to allow browser-side byte-range requests. JBrowse retrieves only the genomic region in the current viewport — the full 295 Mb genome is never downloaded.

---

## Project Structure

```
db2-platform/
├── app/
│   ├── layout.tsx              # Root layout with navbar
│   ├── page.tsx                # Home page
│   ├── genome-browser/         # JBrowse 2 genome browser
│   ├── distribution/           # iNaturalist distribution map
│   ├── genes/                  # Gene search table
│   ├── expression/             # RNA-seq expression data
│   ├── publications/           # Publications library
│   ├── people/                 # Lab directory
│   └── downloads/              # File downloads
│
├── components/
│   ├── genome/
│   │   ├── JBrowseWrapper.tsx      # SSR-safe dynamic import wrapper
│   │   └── JBrowseViewInner.tsx    # JBrowse React component
│   └── map/
│       └── DistributionMap.tsx     # Leaflet + iNaturalist map
│
└── lib/
    └── jbrowse-config.ts           # Assembly and track URL configuration
```

---

## Local Development

### Prerequisites
- Node.js 18+
- npm

### Setup
```bash
git clone https://github.com/researchingadi/db2-platform.git
cd db2-platform
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Version Roadmap

### v1 — Foundation *(current)*
- [x] Homepage with assembly stats and quick navigation
- [x] JBrowse 2 genome browser with chromosome assembly + annotation tracks
- [x] Interactive global distribution map (iNaturalist live API)
- [x] Publications page
- [x] People / lab directory
- [x] Downloads page
- [x] Deployed to Vercel with Cloudflare R2 file hosting

### v2 — Transcriptomics *(in development)*
- [ ] RNA-seq tracks in JBrowse (BAM/BigWig)
- [ ] Gene search table with multi-field filtering
- [ ] Gene detail pages with mini-browser and expression data
- [ ] Biological feature pages: Horns, Legs, Development, Reproduction
- [ ] Expression heatmap visualizations

### v3 — Advanced Tools
- [ ] BLAST sequence search (NCBI BLAST+, FastAPI)
- [ ] Ortholog search across *Onthophagus* species
- [ ] Additional species support
- [ ] Advanced expression visualizations (volcano plots, PCA)

---

## Multi-Species Architecture

All data is internally scoped by species slug, enabling future expansion without schema changes:

```
/species/onthophagus-taurus/genome
/species/onthophagus-taurus/genes
/species/onthophagus-taurus/expression
```

A species selector will be added to the navigation when a second species is onboarded.

---

## Data Sources & Attribution

| Data | Source | Version / Accession |
|---|---|---|
| Genome assembly | NCBI | GCF_036711975.1 (IU_Otau_3.0) |
| NCBI gene annotations | NCBI Annotation Release | GFF3 + GTF |
| Custom annotations | Davidson Lab, MSU | v1 |
| RNA-seq data | Davidson Lab, MSU | In preparation |
| Biodiversity occurrences | [iNaturalist](https://www.inaturalist.org/taxa/125819-Scarabaeinae) | Live API — Taxon ID 125819 |

---

## Citation

If you use (DB)² or the *O. taurus* genome resources in your research, please cite:

> Davidson Lab (2025). *(DB)² — Dung Beetle Database: a genomic and transcriptomic resource for Onthophagus taurus*. Mississippi State University. https://github.com/researchingadi/db2-platform

**Genome assembly:**
> NCBI Assembly GCF_036711975.1 — *Onthophagus taurus* IU_Otau_3.0. National Center for Biotechnology Information.

**Biodiversity occurrence data:**
> iNaturalist contributors (2025). *Scarabaeinae* observations. iNaturalist.org. https://www.inaturalist.org/taxa/125819

---

## Team

| Name | Role | Affiliation |
|---|---|---|
| Dr. Philip L. Davidson | Principal Investigator | Mississippi State University |
| Adi Singh | Bioinformatics Full Stack Developer / Research Software Engineer | Mississippi State University |

---

## Contact

- **Lab website:** [davidsonlab-msu.github.io](https://davidsonlab-msu.github.io/)
- **GitHub Issues:** [researchingadi/db2-platform/issues](https://github.com/researchingadi/db2-platform/issues)
- **Department:** Biological Sciences, Mississippi State University

---

## License

MIT License — see [LICENSE](LICENSE) for details.

Genomic data is sourced from NCBI and subject to [NCBI data use policies](https://www.ncbi.nlm.nih.gov/home/about/policies/).
Biodiversity occurrence data is sourced from iNaturalist and subject to [iNaturalist terms of use](https://www.inaturalist.org/terms).│   │   └── page.tsx            # JBrowse 2 genome browser
│   ├── genes/
│   │   └── page.tsx            # Gene search table
│   ├── expression/
│   │   └── page.tsx            # RNA-seq expression overview
│   ├── publications/
│   │   └── page.tsx            # Publications library
│   ├── people/
│   │   └── page.tsx            # Lab directory
│   └── downloads/
│       └── page.tsx            # File downloads
│
├── components/
│   └── genome/
│       ├── JBrowseWrapper.tsx  # Dynamic import wrapper (SSR-safe)
│       └── JBrowseViewInner.tsx # JBrowse React component
│
├── lib/
│   └── jbrowse-config.ts       # Assembly and track configuration
│
└── public/                     # Static assets
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/researchingadi/db2-platform.git
cd db2-platform
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## Genome Data Pipeline

The genomic files served by JBrowse are processed and hosted on Cloudflare R2. The pipeline to prepare files from raw NCBI data is:

### 1. Install tools

```bash
sudo apt install samtools tabix
```

### 2. Process the genome FASTA

```bash
# Compress with bgzip (NOT regular gzip — they are different)
bgzip -k Otau3.2.fasta

# Index the bgzipped file (creates .fai and .gzi)
samtools faidx Otau3.2.fasta.gz
```

### 3. Process annotation files

```bash
# Sort, compress, and index GFF3
sort -k1,1 -k4,4n annotations.gff3 | bgzip > annotations.sorted.gff3.gz
tabix -p gff annotations.sorted.gff3.gz

# Sort, compress, and index GTF
sort -k1,1 -k4,4n annotations.gtf | bgzip > annotations.sorted.gtf.gz
tabix -p gff annotations.sorted.gtf.gz
```

### 4. Upload to Cloudflare R2

Upload all processed files **and their index files** to the R2 bucket. Index files (`.fai`, `.gzi`, `.tbi`) must be in the same bucket as their parent files.

### 5. Configure CORS on R2

```json
[
  {
    "AllowedOrigins": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedHeaders": ["Range", "Accept-Ranges", "Content-Range"],
    "ExposeHeaders": ["Content-Length", "Content-Range", "Accept-Ranges"],
    "MaxAgeSeconds": 3600
  }
]
```

> **Why bgzip?** JBrowse uses HTTP byte-range requests to fetch only the genomic region currently in view. This requires block-compressed files (bgzip) with matching indexes. Regular gzip does not support random access and will fail silently.

---

## JBrowse Configuration

Assembly and track URLs are defined in `lib/jbrowse-config.ts`. To update a file (e.g. a new annotation release), upload the new processed file to R2 and update the URI in this config — no other changes needed.

```ts
export const DB2_ASSEMBLY = {
  name: "Otau_3.2",
  sequence: {
    type: "ReferenceSequenceTrack",
    trackId: "otau-reference",
    adapter: {
      type: "BgzipFastaAdapter",
      fastaLocation: { uri: "https://YOUR_R2_URL/Otau3.2.fasta.gz" },
      faiLocation:   { uri: "https://YOUR_R2_URL/Otau3.2.fasta.gz.fai" },
      gziLocation:   { uri: "https://YOUR_R2_URL/Otau3.2.fasta.gz.gzi" },
    },
  },
}
```

Track colors and labels are configurable per track. The NCBI annotation track and Davidson Lab custom annotation track are intentionally styled differently so users can immediately distinguish between annotation sources.

---

## Version Roadmap

### v1 — Foundation *(current)*
- [x] Modern homepage
- [x] JBrowse 2 genome browser
- [x] Chromosome-level assembly
- [x] NCBI annotation track
- [x] Davidson Lab custom annotation track
- [ ] Gene search table
- [ ] Publications page
- [ ] People/directory page
- [ ] Downloads page
- [ ] Deployed to production

### v2 — Transcriptomics
- [ ] RNA-seq tracks in JBrowse (BAM/BigWig)
- [ ] Expression overview page
- [ ] Biological feature pages (Horns, Legs, Development)
- [ ] Gene detail pages with expression data
- [ ] Full-text gene search

### v3 — Advanced Tools
- [ ] BLAST search (NCBI BLAST+ self-hosted)
- [ ] Ortholog search
- [ ] Additional *Onthophagus* species
- [ ] Advanced expression visualizations

---

## Multi-Species Architecture

The database is designed to support additional species without restructuring. All data is internally scoped to a species via slug-based routing:

```
/species/onthophagus-taurus/genome
/species/onthophagus-taurus/genes
/species/onthophagus-taurus/expression
```

In v1, these routes are aliased to clean public URLs (`/genome-browser`, `/genes`, etc.). When a second species is added, a species selector is introduced in the navigation — no data model changes required.

---

## Deployment

The app is designed to deploy on Vercel (frontend) with Cloudflare R2 for genomic file hosting.

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

For v3 (BLAST support), a VPS (DigitalOcean or Hetzner) running NCBI BLAST+ with a FastAPI wrapper will be needed in addition to Vercel.

---

## Data Sources

| Data | Source | Version |
|---|---|---|
| Genome assembly | NCBI (GCF_036711975.1) | IU_Otau_3.0 |
| NCBI annotations | NCBI Annotation Release | GFF3 / GTF |
| Custom annotations | Davidson Lab, MSU | v1 |
| RNA-seq data | Davidson Lab, MSU | In progress |

---

## Citation

If you use (DB)² or the *O. taurus* genome assembly in your research, please cite:

> Davidson Lab (2024). *Dung Beetle Database (DB)²: a genomic resource for Onthophagus taurus*. Mississippi State University. https://github.com/operator2036/db2-platform

Assembly citation:
> NCBI Assembly: GCF_036711975.1 — *Onthophagus taurus* IU_Otau_3.0

---

## Contributing

This project is developed by the Davidson Lab at Mississippi State University. For questions about data, annotations, or collaboration:

- **Lab website:** [Davidson Lab, MSU]
- **GitHub issues:** [github.com/researchingadi/db2-platform/issues](https://github.com/researchingadi/db2-platform/issues)

---

## Team

| Name | Role |
|---|---|
| Dr. Philip L. Davidson | Principal Investigator |
| Adi Singh (researchingadi) | Bioinformatics Full Stack Researcher |

---

## License

MIT License — see [LICENSE](LICENSE) for details.

Genomic data and annotations are subject to NCBI data use policies. See [NCBI Disclaimer](https://www.ncbi.nlm.nih.gov/home/about/policies/) for details.
