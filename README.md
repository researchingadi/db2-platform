# (DB)² — Dung Beetle Database

<div align="center">

**A modern genome and transcriptomics database for *Onthophagus taurus***

*Davidson Lab · Department of Biological Sciences · Mississippi State University*

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js&logoColor=white)](https://nextjs.org)
[![Assembly](https://img.shields.io/badge/Assembly-GCF__036711975.1-7c3aed)](https://www.ncbi.nlm.nih.gov/assembly/GCF_036711975.1)
[![iNaturalist](https://img.shields.io/badge/iNaturalist-125819-74ac00)](https://www.inaturalist.org/taxa/125819-Scarabaeinae)
[![Europe PMC](https://img.shields.io/badge/Literature-Europe_PMC-0066cc)](https://europepmc.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/license-MIT-22c55e)](LICENSE)

 [**Davidson Lab**](https://davidsonlab-msu.github.io/)

</div>

---

## Overview

**(DB)²** is an open, web-based genome and transcriptomics database for the dung beetle *Onthophagus taurus* (Schreber, 1759) — a model organism for studying the genomic basis of developmental plasticity, sexual selection, and horn polyphenism. The platform centralizes the chromosome-level genome assembly (GCF_036711975.1), NCBI and Davidson Lab custom gene annotations, RNA-seq expression datasets, global biodiversity occurrence data, and real-time scientific literature in a single, researcher-friendly interface.

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
| **Hosted file format** | bgzipped FASTA + tabix-indexed GFF3/GTF on Cloudflare R2 |

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
- **High zoom (≥ 10):** individual clickable observation markers fetched in real time, each displaying species name, observer, date, quality grade, and photo thumbnail, with direct links to iNaturalist

All occurrence data is sourced live from iNaturalist (Taxon ID: 125819 — Scarabaeinae), covering 122,000+ global observations across 50,000+ observers.

### Literature Search
Real-time academic literature search powered by the [Europe PMC](https://europepmc.org) REST API. Searches 38M+ open-access life sciences papers with default queries tuned for *Onthophagus* research. Results include title, authors, year, journal, citation count, abstract, and direct DOI links. Quick-filter chips for common search terms (e.g. "Onthophagus taurus", "horn polyphenism"). Updated in real time — newly published papers appear automatically with no maintenance required.

### Publications
Curated library of Davidson Lab publications and dung beetle genomics literature with DOI links and dataset cross-references.

### Directory
Lab directory for the Davidson Lab and collaborating principal investigators, including contact information and institutional affiliations.

### Downloads
Direct access to all genomic data files: chromosome-level FASTA assembly, GFF3 and GTF annotation files, and metadata.

### Gene Search *(v2)*
Filterable, sortable table of 28,456+ predicted gene models with search by gene ID, chromosome, coordinate range, annotation source, and RNA-seq availability.

### Expression Data *(v2)*
RNA-seq datasets linked to biological features including horn development, leg morphology, and developmental stage series.

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Framework | Next.js 14 (App Router) | Full-stack React, SSR/SSG, API routing |
| Language | TypeScript 5 | Type-safe development |
| Styling | Tailwind CSS | Utility-first dark-theme UI |
| Genome browser | JBrowse 2 (`@jbrowse/react-linear-genome-view`) | Embedded genomic visualization |
| Distribution map | Leaflet.js + iNaturalist API v1 | Biodiversity occurrence mapping |
| Literature | Europe PMC REST API | Real-time academic literature search |
| File hosting | Cloudflare R2 | Zero-egress genomic file CDN |
| Deployment | Vercel | CI/CD + global edge hosting |

---

## Data Pipeline

All genomic files are preprocessed before deployment to enable efficient byte-range HTTP access in JBrowse.

### Genome FASTA
```bash
# Block-compress with bgzip (required for random access — not compatible with regular gzip)
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

All processed files and indexes are hosted on Cloudflare R2 with the following CORS policy to allow browser-side byte-range requests:

```json
[{
  "AllowedOrigins": ["*"],
  "AllowedMethods": ["GET", "HEAD"],
  "AllowedHeaders": ["Range", "Accept-Ranges", "Content-Range"],
  "ExposeHeaders": ["Content-Length", "Content-Range", "Accept-Ranges"],
  "MaxAgeSeconds": 3600
}]
```

> **Why bgzip?** JBrowse 2 retrieves only the genomic region currently in the viewport using HTTP Range requests. This requires block-level compression (bgzip) paired with a block index (.gzi), enabling sub-second navigation of a 295 Mb genome without transferring the full file.

---

## Project Structure

```
db2-platform/
├── app/
│   ├── layout.tsx              # Root layout with navbar
│   ├── page.tsx                # Home page
│   ├── genome-browser/         # JBrowse 2 genome browser
│   ├── distribution/           # iNaturalist distribution map
│   ├── literature/             # Europe PMC live literature search
│   ├── genes/                  # Gene search table
│   ├── expression/             # RNA-seq expression data
│   ├── publications/           # Curated publications
│   ├── directory/              # Lab directory
│   ├── downloads/              # File downloads
│   └── api/
│       └── literature/         # Server-side Europe PMC proxy
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
- [x] Real-time literature search (Europe PMC API)
- [x] Publications page
- [x] Lab directory with collaborating PIs
- [x] Downloads page
- [x] GitHub repository

### v2 — Transcriptomics *(in development)*
- [ ] Deploy to Vercel (live public URL)
- [ ] RNA-seq tracks in JBrowse (BAM/BigWig)
- [ ] Gene search table with multi-field filtering
- [ ] Gene detail pages with mini-browser and expression data
- [ ] Biological feature pages: Horns, Legs, Development, Reproduction
- [ ] Expression heatmap visualizations
- [ ] PostgreSQL database for gene models

### v3 — Advanced Tools
- [ ] BLAST sequence search (NCBI BLAST+, FastAPI)
- [ ] Ortholog search across *Onthophagus* species
- [ ] Additional species support
- [ ] Advanced expression visualizations (volcano plots, PCA)
- [ ] Resource paper publication

---

## Multi-Species Architecture

All data is internally scoped by species slug, enabling future expansion without schema changes:

```
/species/onthophagus-taurus/genome
/species/onthophagus-taurus/genes
/species/onthophagus-taurus/expression
```

A species selector will be added to the navigation when a second species is onboarded. No data model changes required.

---

## Data Sources & Attribution

| Data | Source | Version / Accession |
|---|---|---|
| Genome assembly | NCBI | GCF_036711975.1 (IU_Otau_3.0) |
| NCBI gene annotations | NCBI Annotation Release | GFF3 + GTF |
| Custom annotations | Davidson Lab, MSU | v1 |
| RNA-seq data | Davidson Lab, MSU | In preparation |
| Biodiversity occurrences | [iNaturalist](https://www.inaturalist.org/taxa/125819-Scarabaeinae) | Live API — Taxon ID 125819 |
| Scientific literature | [Europe PMC](https://europepmc.org) | Live REST API |

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

**Collaborating Principal Investigators:**

| Name | Institution |
|---|---|
| Dr. Sofía Casasa | Boston University |
| Dr. Yonggang Hu | Southwest University |
| Dr. Armin Moczek | Indiana University |
| Dr. Patrick Rohner | University of California San Diego |

---

## Contact

- **Lab website:** [davidsonlab-msu.github.io](https://davidsonlab-msu.github.io/)
- **GitHub Issues:** [researchingadi/db2-platform/issues](https://github.com/researchingadi/db2-platform/issues)
- **Department:** Biological Sciences, Mississippi State University

---

## License

MIT License — see [LICENSE](LICENSE) for details.

Genomic data is sourced from NCBI and subject to [NCBI data use policies](https://www.ncbi.nlm.nih.gov/home/about/policies/).  
Biodiversity occurrence data is sourced from iNaturalist and subject to [iNaturalist terms of use](https://www.inaturalist.org/terms).  
Literature data is sourced from Europe PMC and subject to [Europe PMC terms of use](https://europepmc.org/terms).
Genomic data and annotations are subject to NCBI data use policies. See [NCBI Disclaimer](https://www.ncbi.nlm.nih.gov/home/about/policies/) for details.
