# (DB)² — Dung Beetle Database

> A modern genome and transcriptomics database for *Onthophagus taurus*

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)
[![JBrowse 2](https://img.shields.io/badge/JBrowse-2-blue)](https://jbrowse.org/jb2)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Assembly](https://img.shields.io/badge/Assembly-GCF__036711975.1-purple)](https://www.ncbi.nlm.nih.gov/assembly/GCF_036711975.1)

---

## Overview

(DB)² is a modern, visually engaging genome and transcriptomics database for the dung beetle *Onthophagus taurus*. It integrates chromosome-level genome assembly data, NCBI-generated and Davidson Lab custom gene annotations, RNA-seq datasets linked to biological features, and community resources — all in one accessible platform.

Built as a research resource by the [Davidson Lab](https://davidsonlab-msu.github.io/) at Mississippi State University, (DB)² is designed to be usable by anyone — from expert bioinformaticians to undergraduate researchers exploring beetle genomics for the first time.

---

## Features

- **Genome Browser** — JBrowse 2 embedded viewer with chromosome-level assembly, NCBI annotations, and Davidson Lab custom annotation tracks
- **Gene Search** — filterable, searchable table of 28,456+ predicted gene models with chromosome, position, strand, source, and RNA-seq availability
- **Expression Data** — RNA-seq datasets organized by biological feature (horns, legs, developmental stages)
- **Biological Feature Pages** — gene sets and expression data linked to traits like horn development, leg morphology, and reproduction
- **Publications** — curated library of lab publications and related dung beetle genomics literature
- **People** — Davidson Lab directory with roles, affiliations, and contact information
- **Downloads** — direct access to genome assembly FASTA files, GFF3/GTF annotations, RNA-seq data, and metadata

**Coming in future versions:**
- BLAST sequence search against the *O. taurus* genome and proteome
- Comparative genomics and ortholog search
- Additional *Onthophagus* species

---

## Species & Assembly

| Field | Value |
|---|---|
| Species | *Onthophagus taurus* (Schreber, 1759) |
| Common name | Dung beetle |
| NCBI Taxon ID | 166361 |
| Assembly name | IU_Otau_3.0 |
| Assembly accession | GCF_036711975.1 |
| Assembly level | Chromosome |
| Chromosomes | 12 |
| Genome size | ~295 Mb |
| Annotation source | NCBI + Davidson Lab custom |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Genome browser | JBrowse 2 (`@jbrowse/react-linear-genome-view`) |
| File hosting | Cloudflare R2 (S3-compatible, zero egress fees) |
| Language | TypeScript |
| Package manager | npm |

---

## Project Structure

```
db2-platform/
├── app/
│   ├── layout.tsx              # Root layout, navbar, footer
│   ├── page.tsx                # Home page
│   ├── genome-browser/
│   │   └── page.tsx            # JBrowse 2 genome browser
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
git clone https://github.com/operator2036/db2-platform.git
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
| Adi (researchingadi) | Bioinformatics Web Developer |

---

## License

MIT License — see [LICENSE](LICENSE) for details.

Genomic data and annotations are subject to NCBI data use policies. See [NCBI Disclaimer](https://www.ncbi.nlm.nih.gov/home/about/policies/) for details.
