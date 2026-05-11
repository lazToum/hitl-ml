# ============================================================================
# Human in the Loop — Root Makefile
#
# Four season editions + overview:
#   spring     → editions/spring/    (Interactive platform: FastAPI+Rust+React+Flutter)
#   summer     → editions/summer/    (Jupyter Book HTML, English)
#   autumn     → editions/autumn/    (HTML pamphlet + PDF)
#   winter     → editions/winter/    (LaTeX/PDF trade paperback, 18 ch)
#   overview   → overview/           (Editions overview PDF)
#   translations/XX → editions/translations/   (14 language editions)
#
# Quick reference:
#   make spring               Print Spring platform run instructions
#   make spring-serve         Build and serve Spring handbook at http://localhost:8082
#   make spring-pdf           Build Spring project guide PDF (lualatex)
#   make spring-open          Open Spring project guide PDF
#   make summer               Build Summer HTML
#   make summer-serve         Serve summer at http://localhost:8081
#   make autumn               Open Autumn HTML in browser (macOS)
#   make autumn-pdf           Build Autumn PDF (pandoc → lualatex)
#   make winter               Build Winter PDF (lualatex + biber)
#   make winter-open          Build + open PDF (macOS)
#   make build-hi             Build Hindi HTML
#   make build-all            Build summer + all translations
#   make reader               Build React reader app
#   make dev                  Hot-reload dev (summer + reader)
#   make overview             Compile editions overview PDF (lualatex)
#   make zip-full             Full deliverable bundle
# ============================================================================

.DEFAULT_GOAL := help

LANG_CODES := el ru fr de zh hi es fa ar sw am ha tr
LANG_SERVE_BASE := 8082

SUMMER_DIR     := editions/summer
WINTER_DIR     := editions/winter
SPRING_DIR     := editions/spring
AUTUMN_DIR     := editions/autumn
OVERVIEW_DIR   := overview
TRANS_DIR      := editions/summer/translations
EN_DIR         := $(TRANS_DIR)/en

.PHONY: deploy deploy-limen deploy-whatif \
        help build pdf clean serve install \
        summer summer-pdf summer-clean summer-serve summer-dev \
        spring spring-book spring-clean spring-serve spring-pdf spring-open \
        autumn autumn-pdf autumn-open \
        overview \
        winter winter-clean winter-open \
        spring-guide spring-guide-open \
        en en-pdf \
        $(addprefix build-,  $(LANG_CODES)) \
        $(addprefix pdf-,    $(LANG_CODES)) \
        $(addprefix clean-,  $(LANG_CODES)) \
        build-all pdf-all clean-all \
        reader reader-dev reader-install reader-sync \
        sync-player link-player \
        zip zip-full zip-check zip-source \
        backup backup-sd1 backup-ha backup-sd1-clean dev \
        push push-github push-gitlab

# Provide imghdr shim for Python 3.13 (removed from stdlib)
export PYTHONPATH := $(CURDIR)/build/compat:$(PYTHONPATH)

help:
	@printf "\nHuman in the Loop — available targets\n\n"
	@printf "  install          Install Python dependencies\n"
	@printf "  summer           Build Summer Jupyter Book HTML\n"
	@printf "  summer-serve     Build and serve Summer HTML on port 8081\n"
	@printf "  summer-pdf       Build Summer PDF\n"
	@printf "  spring           Print Spring platform run instructions\n"
	@printf "  spring-serve     Build and serve Spring handbook HTML on port 8082\n"
	@printf "  spring-pdf       Build Spring project guide PDF\n"
	@printf "  autumn           Open the Autumn self-contained HTML\n"
	@printf "  autumn-pdf       Build Autumn pamphlet PDF\n"
	@printf "  winter           Build Winter LaTeX PDF\n"
	@printf "  overview         Build editions overview PDF\n"
	@printf "  reader-install   Install React reader dependencies\n"
	@printf "  reader           Build React reader app\n"
	@printf "  build-all        Build Summer plus translations\n"
	@printf "  zip-full         Build full deliverable bundle\n"
	@printf "  zip-source       Zip full source tree (no build artifacts)\n"
	@printf "  backup           Backup source to SD1 + Home Assistant\n"
	@printf "  backup-sd1       Rsync source to SD1 + copy zip\n"
	@printf "  backup-ha        Copy zip to root@192.168.1.5\n"
	@printf "  backup-sd1-clean Remove old /p/ folder from SD1 (~6.1 GB)\n"
	@printf "  deploy           Deploy both VMs (limen + whatif)\n"
	@printf "  deploy-limen     Deploy limen-os.io (tam@dev)\n"
	@printf "  deploy-whatif    Rsync to what-if.io VM\n"
	@printf "  push             Push to GitHub + GitLab (both remotes)\n\n"

# ── Git push (GitHub primary + GitLab mirror) ────────────────────────────────
push: push-github push-gitlab

push-github:
	git push origin main

push-gitlab:
	git push gitlab main

# ── Deploy ───────────────────────────────────────────────────────────────────
deploy: deploy-limen deploy-whatif

deploy-limen:
	bash deploy/limen-osio/deploy.sh

deploy-whatif:
	@cp companion/web/index.html dist/site/companion/index.html
	rsync -avz --exclude='.git/' --exclude='node_modules/' --exclude='target/' \
	  --exclude='dist/' --exclude='.bun/' --exclude='.DS_Store' --exclude='*.mov' --exclude='*.mp4' \
	  . whatif:~/p/main/
	rsync -avz dist/site/ whatif:~/p/main/dist/site/
	rsync -avz dist/reader/ whatif:~/p/main/dist/reader/
	rsync -avz dist/comic/ whatif:~/p/main/dist/comic/
	@if [ -d "/Users/laztoum/Projects/p/other/agents-comic/player/backend" ]; then \
	  rsync -avz --exclude='.git/' --exclude='node_modules/' --exclude='__pycache__/' --exclude='venv/' \
	    /Users/laztoum/Projects/p/other/agents-comic/player/backend/ whatif:~/p/other/agents-comic/player/backend/; \
	else \
	  echo "→ Skipping agents-comic backend (not present on this machine)"; \
	fi
	ssh whatif "cd ~/p/main && docker compose -f deploy/what-ifio/docker-compose.yml up -d --force-recreate caddy"

install:
	pip install -r requirements.txt

# ── Summer edition (Jupyter Book HTML, English) ───────────────────────────────
summer:
	jupyter-book build $(SUMMER_DIR)/
	@cp $(SUMMER_DIR)/_static/custom.css $(SUMMER_DIR)/_build/html/_static/custom.css 2>/dev/null || true
	@rsync -a --copy-links $(SUMMER_DIR)/comic/ $(SUMMER_DIR)/_build/html/comic/ 2>/dev/null || true

summer-pdf:
	python3 build/scripts/inject_html_links.py
	jupyter-book build $(SUMMER_DIR)/ --builder pdflatex

summer-clean:
	jupyter-book clean $(SUMMER_DIR)/

summer-serve: summer
	@echo "→ Summer HTML at http://localhost:8081"
	cd $(SUMMER_DIR)/_build/html && python -m http.server 8081

summer-dev: summer
	@echo "→ Summer HTML at http://localhost:8081"
	cd $(SUMMER_DIR)/_build/html && python -m http.server 8081

# ── Spring edition (Interactive platform — docker-compose + project guide PDF) ─
spring:
	@echo "→ Spring platform: see $(SPRING_DIR)/docker-compose.yml"
	@echo "   Run: cd $(SPRING_DIR) && cp .env.example .env && docker compose up"

spring-pdf: spring-guide

spring-book:
	jupyter-book clean $(SPRING_DIR)/
	jupyter-book build $(SPRING_DIR)/
	@cp $(SPRING_DIR)/_static/spring.css $(SPRING_DIR)/_build/html/_static/spring.css 2>/dev/null || true

spring-open:
	open $(SPRING_DIR)/project_guide.pdf

spring-clean:
	cd $(SPRING_DIR) && rm -f *.aux *.log *.toc *.out 2>/dev/null || true

spring-serve: spring-book
	@echo "→ Spring Handbook at http://localhost:8082"
	cd $(SPRING_DIR)/_build/html && python -m http.server 8082

# ── Autumn edition (self-contained HTML + pandoc PDF) ────────────────────────
autumn:
	@echo "→ Autumn edition: $(AUTUMN_DIR)/index.html"
	open $(AUTUMN_DIR)/index.html

autumn-pdf:
	pandoc $(AUTUMN_DIR)/source.md \
	  --pdf-engine=lualatex \
	  --metadata title="Human in the Loop: What You Think It Means vs. What It Actually Is" \
	  --metadata author="Lazaros Toumanidis" \
	  --metadata subtitle="A Pamphlet for New Annotation Team Members" \
	  -V title="Human in the Loop: What You Think It Means vs. What It Actually Is" \
	  -V subtitle="A Pamphlet for New Annotation Team Members" \
	  -V author="Lazaros Toumanidis" \
	  -V date="Autumn Edition · 2026" \
	  -V geometry:margin=2.5cm \
	  -V fontsize=11pt \
	  -V linestretch=1.6 \
	  -V colorlinks=true \
	  -o $(AUTUMN_DIR)/hitl_autumn_edition.pdf
	@echo "→ PDF at $(AUTUMN_DIR)/hitl_autumn_edition.pdf"

autumn-open: autumn-pdf
	open $(AUTUMN_DIR)/hitl_autumn_edition.pdf

# ── Editions overview (LuaLaTeX) ─────────────────────────────────────────────
overview:
	cd $(OVERVIEW_DIR) && \
	  lualatex editions_overview.tex && \
	  lualatex editions_overview.tex
	@echo "→ PDF at $(OVERVIEW_DIR)/editions_overview.pdf"

# ── Companion research paper (LaTeX/PDF) ─────────────────────────────────────
companion-paper:
	cd companion/papers && \
	  xelatex -interaction=nonstopmode hitl_resilience.tex && \
	  bibtex hitl_resilience && \
	  xelatex -interaction=nonstopmode hitl_resilience.tex && \
	  xelatex -interaction=nonstopmode hitl_resilience.tex
	@echo "→ PDF at companion/papers/hitl_resilience.pdf"

# ── Winter edition (LaTeX/PDF) ────────────────────────────────────────────────
winter:
	cd $(WINTER_DIR)/latex && \
	  lualatex -interaction=nonstopmode main.tex && \
	  biber main && \
	  makeindex main.idx -s indexstyle.ist && \
	  lualatex -interaction=nonstopmode main.tex && \
	  lualatex -interaction=nonstopmode main.tex
	@echo "→ PDF at $(WINTER_DIR)/latex/main.pdf"

winter-clean:
	cd $(WINTER_DIR)/latex && \
	  rm -f *.aux *.bbl *.bcf *.blg *.idx *.ilg *.ind *.log *.out *.run.xml *.toc *.lof *.lot

winter-open: winter
	open $(WINTER_DIR)/latex/main.pdf

# ── Spring project guide (LaTeX/PDF — the Spring edition PDF) ────────────────
spring-guide:
	cd $(SPRING_DIR) && \
	  lualatex -interaction=nonstopmode project_guide.tex && \
	  lualatex -interaction=nonstopmode project_guide.tex
	@echo "→ PDF at $(SPRING_DIR)/project_guide.pdf"

spring-guide-open: spring-guide
	open $(SPRING_DIR)/project_guide.pdf

# ── English reference edition (Jupyter Book, base for translations) ───────────
en:
	jupyter-book build $(EN_DIR)/
	@cp $(EN_DIR)/_static/custom.css $(EN_DIR)/_build/html/_static/custom.css 2>/dev/null || true

en-pdf:
	jupyter-book build $(EN_DIR)/ --builder pdflatex

# Legacy aliases (old targets still work)
build: en
pdf:   en-pdf
clean:
	jupyter-book clean $(EN_DIR)/
serve: en
	cd $(EN_DIR)/_build/html && python -m http.server 8080

# ── Language translations ─────────────────────────────────────────────────────
define LANG_RULES
build-$(1):
	jupyter-book build $(TRANS_DIR)/$(1)/
	@cp $(EN_DIR)/_static/custom.css $(TRANS_DIR)/$(1)/_build/html/_static/custom.css 2>/dev/null || true
	@cp $(TRANS_DIR)/$(1)/_static/logo.svg $(TRANS_DIR)/$(1)/_build/html/_static/logo.svg 2>/dev/null || true

pdf-$(1):
	jupyter-book build $(TRANS_DIR)/$(1)/ --builder pdflatex

clean-$(1):
	jupyter-book clean $(TRANS_DIR)/$(1)/

endef
$(foreach lang,$(LANG_CODES),$(eval $(call LANG_RULES,$(lang))))

build-all: summer en $(addprefix build-, $(LANG_CODES))
pdf-all:   summer-pdf en-pdf $(addprefix pdf-, $(LANG_CODES))
clean-all: summer-clean clean $(addprefix clean-, $(LANG_CODES)) winter-clean

# ── Reader app (React + games + TTS) ─────────────────────────────────────────
reader: reader-sync
	cd web/reader && npm run build

reader-install:
	cd web/reader && npm install

reader-sync:
	rsync -a --delete $(SUMMER_DIR)/chapters/ web/reader/public/summer/chapters/
	@echo "Synced summer chapters → web/reader/public/summer/chapters/"

reader-dev:
	@echo "→ Syncing chapters…"
	rsync -a --delete $(SUMMER_DIR)/chapters/ web/reader/public/summer/chapters/
	@echo "→ React reader at http://localhost:5174"
	cd web/reader && npm run dev -- --port 5174

# ── Dev: both servers in parallel ────────────────────────────────────────────
dev:
	@echo "Starting dev servers…"
	@echo "  Summer HTML  → http://localhost:8081"
	@echo "  React reader → http://localhost:5174"
	$(MAKE) summer
	rsync -a --delete $(SUMMER_DIR)/chapters/ web/reader/public/summer/chapters/
	@(cd $(SUMMER_DIR)/_build/html && python -m http.server 8081) & \
	 (cd web/reader && npm run dev -- --port 5174)

# ── Integration with external player (Breath/patato5) ────────────────────────
PLAYER_SUMMER := $(HOME)/Projects/patato5/apps/player/public/summer

link-player:
	ln -sfn $(CURDIR)/$(SUMMER_DIR)/chapters $(PLAYER_SUMMER)/chapters
	@echo "Symlinked $(SUMMER_DIR)/chapters → player/public/summer/chapters"

sync-player:
	rsync -av --delete $(SUMMER_DIR)/chapters/ $(PLAYER_SUMMER)/chapters/
	@echo "Synced $(SUMMER_DIR)/chapters → player/public/summer/chapters"

# ── Deliverable zip archives ──────────────────────────────────────────────────
ZIP_DATE := $(shell date +%Y%m%d)
ZIP_PDFS := hitl-ml-pdfs-$(ZIP_DATE).zip
ZIP_FULL := hitl-ml-full-$(ZIP_DATE).zip

zip: spring-pdf summer-pdf winter autumn-pdf
	@mkdir -p dist
	@cp $(SPRING_DIR)/project_guide.pdf dist/hitl_spring_edition.pdf
	@cp $(SUMMER_DIR)/_build/latex/hitl_summer_edition.pdf dist/
	@cp $(AUTUMN_DIR)/hitl_autumn_edition.pdf dist/
	@cp $(WINTER_DIR)/latex/main.pdf dist/hitl_winter_edition.pdf
	@$(MAKE) zip-check
	@cd dist && zip -j ../$(ZIP_PDFS) hitl_spring_edition.pdf hitl_summer_edition.pdf hitl_autumn_edition.pdf hitl_winter_edition.pdf
	@echo "→ $(ZIP_PDFS)  (all four season PDFs)"

ZIP_SRC := hitl-ml-src-$(ZIP_DATE).zip

zip-source:
	@echo "→ Zipping source (excluding build artifacts and dependencies)…"
	zip -r $(ZIP_SRC) . \
	  --exclude '*.git*' \
	  --exclude '*/node_modules/*' \
	  --exclude 'node_modules/*' \
	  --exclude '*/venv/*' \
	  --exclude 'venv/*' \
	  --exclude '*/target/*' \
	  --exclude 'target/*' \
	  --exclude '*/_build/*' \
	  --exclude '_build/*' \
	  --exclude '*/dist/*' \
	  --exclude 'dist/*' \
	  --exclude '*/.bun/*' \
	  --exclude '.bun/*' \
	  --exclude '*/__pycache__/*' \
	  --exclude '__pycache__/*' \
	  --exclude '*.pyc' \
	  --exclude '*.DS_Store' \
	  --exclude '*.egg-info*' \
	  --exclude '*.lock' \
	  --exclude '*/.mypy_cache/*' \
	  --exclude '.mypy_cache/*' \
	  --exclude '*/vendor/*' \
	  --exclude 'vendor/*' \
	  --exclude '*/.cargo/*' \
	  --exclude '*/Cargo.lock' \
	  --exclude '*/bun.lock' \
	  --exclude '*.map' \
	  --exclude '*.vsix' \
	  --exclude '*/.gradle/*' \
	  --exclude '.gradle/*' \
	  --exclude '*/agentflow/static/*' \
	  --exclude 'hitl-ml-*.zip'
	@echo "→ $(ZIP_SRC)  ($$(du -sh $(ZIP_SRC) | cut -f1))"

SD1         := /Volumes/SD1
HA_HOST     := root@192.168.1.5
HA_DEST     := /root/backup/p-main

RSYNC_EXCL  := --exclude '.git/' --exclude '*/node_modules/' --exclude '*/venv/' \
               --exclude '*/target/' --exclude '*/_build/' --exclude '*/dist/' \
               --exclude '*/.bun/' --exclude '*/__pycache__/' --exclude '*.pyc' \
               --exclude '*.DS_Store' --exclude '*.egg-info' --exclude '*.lock' \
               --exclude '*/.mypy_cache/' --exclude '*/vendor/' --exclude '*/.cargo/' \
               --exclude '*.map' --exclude '*.vsix' --exclude '*/.gradle/' \
               --exclude '*/agentflow/static/' --exclude 'hitl-ml-*.zip'

# ── Backup to SD1 + Home Assistant ───────────────────────────────────────────
backup: backup-sd1 backup-ha
	@echo "✓ Backup complete"

backup-sd1: zip-source
	@echo "→ Rsyncing source to $(SD1)/p-main/ …"
	@rsync -a --delete $(RSYNC_EXCL) . $(SD1)/p-main/
	@echo "→ Copying zip to $(SD1)/ …"
	@cp $(ZIP_SRC) $(SD1)/$(ZIP_SRC)
	@echo "→ Writing restore note …"
	@printf "# Restore\n\nrsync -a --delete $(SD1)/p-main/ ~/Projects/p/main/\n" > $(SD1)/RESTORE.md
	@echo "✓ SD1 backup done ($$(df -h $(SD1) | awk 'NR==2{print $$4}') free)"

backup-ha: zip-source
	@echo "→ Copying zip to $(HA_HOST):$(HA_DEST)/ …"
	@ssh $(HA_HOST) "mkdir -p $(HA_DEST)"
	@rsync -avz $(ZIP_SRC) $(HA_HOST):$(HA_DEST)/$(ZIP_SRC)
	@echo "✓ HA backup done"

backup-sd1-clean:
	@echo "→ Removing old /p/ folder from SD1 (6.1 GB) …"
	@rm -rf $(SD1)/p
	@echo "✓ Freed ~6.1 GB on SD1"

zip-check:
	@test -s dist/hitl_spring_edition.pdf
	@test -s dist/hitl_summer_edition.pdf
	@test -s dist/hitl_autumn_edition.pdf
	@test -s dist/hitl_winter_edition.pdf

zip-full: spring-pdf summer summer-pdf reader winter autumn-pdf
	@mkdir -p dist
	@cp $(SPRING_DIR)/project_guide.pdf dist/hitl_spring_edition.pdf
	@cp $(SUMMER_DIR)/_build/latex/hitl_summer_edition.pdf dist/
	@cp $(AUTUMN_DIR)/hitl_autumn_edition.pdf dist/
	@cp $(WINTER_DIR)/latex/main.pdf dist/hitl_winter_edition.pdf
	@$(MAKE) zip-check
	@rm -rf dist/summer_interactive dist/reader_app
	@cp -r $(SUMMER_DIR)/_build/html dist/summer_interactive
	@cp -r web/reader/dist dist/reader_app
	@printf "Human in the Loop — Deliverable Package\n\n" > dist/README.txt
	@printf "Four Season Editions:\n" >> dist/README.txt
	@printf "  hitl_spring_edition.pdf   — Spring edition (interactive platform guide)\n" >> dist/README.txt
	@printf "  hitl_summer_edition.pdf   — Summer edition (Jupyter Book)\n" >> dist/README.txt
	@printf "  hitl_autumn_edition.pdf   — Autumn edition pamphlet\n" >> dist/README.txt
	@printf "  hitl_winter_edition.pdf   — Winter edition (trade paperback, 18 chapters)\n" >> dist/README.txt
	@printf "\n" >> dist/README.txt
	@printf "Interactive:\n" >> dist/README.txt
	@printf "  reader_app/               — Summer Reader App (recommended)\n" >> dist/README.txt
	@printf "    macOS: double-click 'Open Reader.command' inside reader_app/\n" >> dist/README.txt
	@printf "    Other: cd reader_app && python3 -m http.server 3030\n" >> dist/README.txt
	@printf "           then open http://localhost:3030\n" >> dist/README.txt
	@printf "  summer_interactive/       — Jupyter Book HTML (fallback)\n" >> dist/README.txt
	@printf "    Open summer_interactive/intro.html in any browser.\n" >> dist/README.txt
	@cd dist && zip -r ../$(ZIP_FULL) hitl_spring_edition.pdf hitl_summer_edition.pdf hitl_autumn_edition.pdf hitl_winter_edition.pdf reader_app/ summer_interactive/ README.txt
	@echo "→ $(ZIP_FULL)"
