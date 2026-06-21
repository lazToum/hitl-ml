LATEX_DIR = latex
PDF      = $(LATEX_DIR)/main.pdf
MAIN     = main

.PHONY: pdf clean open

pdf:
	cd $(LATEX_DIR) && lualatex -interaction=nonstopmode $(MAIN).tex
	cd $(LATEX_DIR) && biber $(MAIN)
	cd $(LATEX_DIR) && makeindex $(MAIN).idx -s indexstyle.ist
	cd $(LATEX_DIR) && lualatex -interaction=nonstopmode $(MAIN).tex
	cd $(LATEX_DIR) && lualatex -interaction=nonstopmode $(MAIN).tex
	@echo "→ $(PDF)"

clean:
	cd $(LATEX_DIR) && rm -f *.aux *.bbl *.bcf *.blg *.idx *.ilg *.ind \
	  *.log *.run.xml *.synctex.gz *.toc *.out *.fls *.fdb_latexmk

open:
	open $(PDF)
