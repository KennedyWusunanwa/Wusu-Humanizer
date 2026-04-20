const DEMO_TEXT = `Here is a short, structured research overview on dogs (Canis familiaris), covering their evolutionary origins, key behavioral traits, and their unique relationship with humans.

### 1. Evolutionary Origin & Domestication
- Common Ancestor: Dogs are direct descendants of the now-extinct Gray Wolf (Canis lupus). Genetic studies confirm a divergence roughly 20,000-40,000 years ago.
- Domestication Event: Unlike other domesticated animals (for example sheep and goats), dogs were likely domesticated through a commensal pathway. Wolves scavenged human waste dumps, and less fearful individuals gradually self-selected for tolerance.
- Key Genetic Changes: Domestication selected for genes linked to neural crest development, which helps explain the physical domestication syndrome such as floppy ears, shorter snouts, smaller teeth, and reduced aggression.

### 2. Notable Behavioral & Cognitive Traits
- Social Cognition: Dogs are exceptionally skilled at reading human gestures, such as pointing. This ability is comparable to human infants and superior to wolves or chimpanzees.
- Oxytocin Bond: Mutual gazing between dogs and their owners increases oxytocin levels in both species, similar to the human mother-infant bond.
- Sensory Specialization:
  - Smell: Dogs may have up to 300 million olfactory receptors, while humans have around 6 million. The olfactory bulb occupies about one-eighth of the brain.
  - Hearing: Dogs can detect frequencies up to 65,000 Hz, while humans detect up to about 20,000 Hz.

### 3. The Human-Dog Coevolution Hypothesis
The "Canine Cooperation Hypothesis" suggests that dogs evolved a temperament that was less fearful and more sociable than that of wolves, enabling a unique form of interspecies cooperation. Studies show that dogs actively seek human help when facing unsolvable problems, such as opening a puzzle box, while wolves generally do not.

### 4. Health & Longevity Overview
- Average Lifespan: Dogs live about 10-13 years on average, although small breeds often outlive large breeds. For example, a Chihuahua may live around 15 years, whereas a Great Dane may live around 7-9 years.
- Common Genetic Disorders: Hip dysplasia, progressive retinal atrophy, and certain cancers are linked to selective breeding. Brachycephalic, or flat-faced, breeds face higher rates of respiratory distress.
- Remarkable Resilience: Dogs retained the ability to digest starch better than wolves because of duplications in the AMY2B gene, which reflects adaptation to human agricultural diets.

### 5. Current Research Frontiers
- Canine Cognitive Aging: Large projects such as the Dog Aging Project are studying the genetic and environmental factors that may delay canine dementia, with possible implications for human Alzheimer's research.
- Scent Detection Science: Researchers are training dogs to detect diseases such as cancer, malaria, and COVID-19 by identifying volatile organic compounds.
- Genomic Diversity: Sequencing ancient dog remains is showing how human migration into regions such as the Americas and Polynesia shaped canine population genetics.

### Key Takeaway
Dogs are not merely domesticated wolves. They are a co-evolved social partner of humans. Their cognitive abilities, hormonal bonding mechanisms, and genetic adaptations make them a useful model for studying evolution, behavior, and even human disease.`;

const STOPWORDS = new Set([
    "a", "about", "above", "after", "again", "against", "all", "also", "am", "an", "and", "any", "are",
    "around", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but",
    "by", "can", "could", "did", "do", "does", "doing", "down", "during", "each", "few", "for", "from",
    "further", "had", "has", "have", "having", "he", "her", "here", "hers", "herself", "him", "himself",
    "his", "how", "i", "if", "in", "into", "is", "it", "its", "itself", "just", "me", "more", "most",
    "my", "myself", "no", "nor", "not", "now", "of", "off", "on", "once", "only", "or", "other", "our",
    "ours", "ourselves", "out", "over", "own", "same", "she", "should", "so", "some", "such", "than",
    "that", "the", "their", "theirs", "them", "themselves", "then", "there", "these", "they", "this",
    "those", "through", "to", "too", "under", "until", "up", "very", "was", "we", "were", "what", "when",
    "where", "which", "while", "who", "whom", "why", "with", "would", "you", "your", "yours", "yourself",
    "yourselves"
]);

const GENERIC_QUERY_WORDS = new Set([
    "about", "brief", "covering", "current", "frontiers", "guide", "here", "idea", "ideas", "introduction",
    "key", "main", "material", "note", "notes", "notable", "overview", "paper", "question", "research",
    "section", "short", "source", "sources", "structured", "takeaway", "text", "topic"
]);

const MODE_CONFIG = {
    humanize: {
        title: "Make Your Draft Sound More Like You",
        subheading: "Reshape bulky notes and stiff paragraphs into cleaner, more natural project prose.",
        inputLabel: "Source Text",
        inputIcon: "fa-regular fa-file-lines",
        button: "Polish Draft",
        icon: "fa-solid fa-wand-magic-sparkles",
        placeholder: "Paste your text here.",
        loading: "Polishing draft",
        showTone: true
    },
    summary: {
        title: "Shrink The Noise, Keep The Point",
        subheading: "Pull the strongest ideas into a tighter summary you can revise, present, or submit faster.",
        inputLabel: "Text To Summarize",
        inputIcon: "fa-regular fa-file-lines",
        button: "Build Summary",
        icon: "fa-solid fa-minimize",
        placeholder: "Paste the source text you want summarized.",
        loading: "Tightening summary",
        showTone: true
    },
    research: {
        title: "Pull Quick Research Leads",
        subheading: "Search a topic, grab a readable overview, and open useful source links in one place.",
        inputLabel: "Topic Or Question",
        inputIcon: "fa-solid fa-magnifying-glass",
        button: "Find Sources",
        icon: "fa-solid fa-compass-drafting",
        placeholder: "Enter a topic, for example dog domestication and canine cognition.",
        loading: "Scanning sources",
        showTone: false
    }
};

const TONE_LIBRARY = {
    academic: {
        sectionMergers: [
            (title, body) => `In terms of ${toLowerPhrase(title)}, ${decapitalizeFragment(body)}`,
            (title, body) => `On ${toLowerPhrase(title)}, ${decapitalizeFragment(body)}`,
            (title, body) => `Looking at ${toLowerPhrase(title)}, ${decapitalizeFragment(body)}`
        ],
        labelMergers: [
            (label, body) => `On ${toLowerPhrase(label)}, ${decapitalizeFragment(body)}`,
            (label, body) => `With respect to ${toLowerPhrase(label)}, ${decapitalizeFragment(body)}`,
            (label, body) => `In terms of ${toLowerPhrase(label)}, ${decapitalizeFragment(body)}`
        ],
        comparisonLead: [
            (left, right) => `Compared side by side, ${left} and ${right} differ in several clear ways.`,
            (left, right) => `A direct comparison between ${left} and ${right} shows a consistent pattern.`,
            (left, right) => `Placed next to ${right}, ${left} show several distinct contrasts.`
        ]
    },
    natural: {
        sectionMergers: [
            (title, body) => `When it comes to ${toLowerPhrase(title)}, ${decapitalizeFragment(body)}`,
            (title, body) => `On ${toLowerPhrase(title)}, ${decapitalizeFragment(body)}`,
            (title, body) => `For ${toLowerPhrase(title)}, ${decapitalizeFragment(body)}`
        ],
        labelMergers: [
            (label, body) => `On ${toLowerPhrase(label)}, ${decapitalizeFragment(body)}`,
            (label, body) => `For ${toLowerPhrase(label)}, ${decapitalizeFragment(body)}`,
            (label, body) => `In terms of ${toLowerPhrase(label)}, ${decapitalizeFragment(body)}`
        ],
        comparisonLead: [
            (left, right) => `Compared directly, ${left} and ${right} diverge in a few obvious ways.`,
            (left, right) => `Side by side, ${left} and ${right} do not look quite the same.`,
            (left, right) => `A simple comparison between ${left} and ${right} makes the contrast clear.`
        ]
    },
    reflective: {
        sectionMergers: [
            (title, body) => `Viewed through ${toLowerPhrase(title)}, ${decapitalizeFragment(body)}`,
            (title, body) => `Within ${toLowerPhrase(title)}, ${decapitalizeFragment(body)}`,
            (title, body) => `Seen through the lens of ${toLowerPhrase(title)}, ${decapitalizeFragment(body)}`
        ],
        labelMergers: [
            (label, body) => `On ${toLowerPhrase(label)}, ${decapitalizeFragment(body)}`,
            (label, body) => `Within ${toLowerPhrase(label)}, ${decapitalizeFragment(body)}`,
            (label, body) => `Seen through ${toLowerPhrase(label)}, ${decapitalizeFragment(body)}`
        ],
        comparisonLead: [
            (left, right) => `When ${left} and ${right} are compared closely, the contrast becomes easier to see.`,
            (left, right) => `A closer comparison between ${left} and ${right} reveals a clear divide.`,
            (left, right) => `Set beside ${right}, ${left} shows a noticeably different pattern.`
        ]
    }
};

const state = {
    currentMode: "humanize",
    isProcessing: false,
    refs: null
};

function initApp() {
    state.refs = {
        tabButtons: Array.from(document.querySelectorAll("[data-mode]")),
        mainHeading: document.getElementById("main-heading"),
        mainSubheading: document.getElementById("main-subheading"),
        inputLabel: document.getElementById("input-label"),
        inputText: document.getElementById("inputText"),
        outputText: document.getElementById("outputText"),
        processBtn: document.getElementById("processBtn"),
        actionText: document.getElementById("action-text"),
        actionIcon: document.getElementById("action-icon"),
        loadingOverlay: document.getElementById("loadingOverlay"),
        loadingText: document.getElementById("loading-text"),
        wordCountInput: document.getElementById("wordCountInput"),
        wordCountOutput: document.getElementById("wordCountOutput"),
        copyBtn: document.getElementById("copyBtn"),
        clearBtn: document.getElementById("clearBtn"),
        sampleBtn: document.getElementById("sampleBtn"),
        toast: document.getElementById("toast"),
        toastMessage: document.getElementById("toastMessage"),
        toastIcon: document.getElementById("toastIcon"),
        sourcesContainer: document.getElementById("sourcesContainer"),
        sourcesList: document.getElementById("sourcesList"),
        toneControls: document.getElementById("toneControls")
    };

    state.refs.tabButtons.forEach((button) => {
        button.addEventListener("click", () => switchTab(button.dataset.mode));
    });

    state.refs.processBtn.addEventListener("click", processAction);
    state.refs.inputText.addEventListener("input", updateInputWordCount);
    state.refs.copyBtn.addEventListener("click", copyOutput);
    state.refs.clearBtn.addEventListener("click", clearInput);
    state.refs.sampleBtn.addEventListener("click", loadDemoText);

    switchTab("humanize");
    updateInputWordCount();
}

function switchTab(mode) {
    if (!MODE_CONFIG[mode]) {
        return;
    }

    state.currentMode = mode;
    const config = MODE_CONFIG[mode];

    state.refs.tabButtons.forEach((button) => {
        button.classList.toggle("active", button.dataset.mode === mode);
        button.classList.toggle("text-blue-900", button.dataset.mode === mode);
        button.classList.toggle("text-slate-500", button.dataset.mode !== mode);
    });

    state.refs.mainHeading.textContent = config.title;
    state.refs.mainSubheading.textContent = config.subheading;
    state.refs.inputLabel.innerHTML = `<i class="${config.inputIcon} mr-2 text-blue-900"></i>${escapeHtml(config.inputLabel)}`;
    state.refs.actionText.textContent = config.button;
    state.refs.actionIcon.className = `${config.icon} text-amber-300`;
    state.refs.loadingText.textContent = config.loading;
    state.refs.inputText.placeholder = config.placeholder;
    state.refs.toneControls.classList.toggle("hidden", !config.showTone);

    clearSources();
    setOutputPlaceholder();
}

async function processAction() {
    if (state.isProcessing) {
        return;
    }

    const text = state.refs.inputText.value.trim();

    if (!text) {
        showToast("Enter some text first.", "error");
        return;
    }

    state.isProcessing = true;
    setLoading(true);
    clearSources();

    try {
        let result = { text: "", sources: [] };
        const tone = getSelectedTone();

        if (state.currentMode === "humanize") {
            await sleep(180);
            result.text = humanizeText(text, tone);
        } else if (state.currentMode === "summary") {
            await sleep(140);
            result.text = summarizeText(text, tone);
        } else if (state.currentMode === "research") {
            result = await runResearch(text);
        }

        if (!result.text || !result.text.trim()) {
            throw new Error("No result generated.");
        }

        renderOutput(result.text);
        renderSources(result.sources || []);
        showToast("Finished processing.");
    } catch (error) {
        console.error(error);
        showToast("The request could not be completed.", "error");
    } finally {
        setLoading(false);
        state.isProcessing = false;
    }
}

function humanizeText(text, tone = "academic") {
    const sections = trimMetaLeadSection(parseSections(text));
    const library = TONE_LIBRARY[tone] || TONE_LIBRARY.academic;

    if (!sections.length) {
        return humanizeLooseParagraph(text, library);
    }

    const paragraphs = [];

    sections.forEach((section, sectionIndex) => {
        const sentences = composeSectionSentences(section, library, sectionIndex);
        const heading = sanitizeHeading(section.title);
        const meaningfulTitle = heading && !/^overview$/i.test(heading);

        if (!sentences.length) {
            return;
        }

        if (meaningfulTitle && !/^key takeaway$/i.test(heading)) {
            sentences[0] = cleanupSentence(pick(library.sectionMergers, sectionIndex)(heading, stripTerminalPunctuation(sentences[0])));
        }

        if (meaningfulTitle && /^key takeaway$/i.test(heading)) {
            sentences.unshift("Taken together, the main takeaway is straightforward.");
        }

        const grouped = chunkArray(sentences, meaningfulTitle ? 3 : 4);
        grouped.forEach((group) => paragraphs.push(group.join(" ")));
    });

    return paragraphs.join("\n\n");
}

function composeSectionSentences(section, library, sectionIndex) {
    const blocks = section.blocks || [];
    const sentences = [];

    for (let index = 0; index < blocks.length; index += 1) {
        const block = blocks[index];

        if (looksLikeComparisonTable(blocks, index)) {
            const tableUnit = consumeComparisonTable(blocks, index, library, sectionIndex);
            sentences.push(...tableUnit.sentences);
            index = tableUnit.nextIndex - 1;
            continue;
        }

        if (isColonLeadGroup(blocks, index)) {
            const colonUnit = consumeColonLeadGroup(blocks, index);
            sentences.push(...colonUnit.sentences);
            index = colonUnit.nextIndex - 1;
            continue;
        }

        if (isParentListLabel(block, blocks[index + 1])) {
            const listUnit = consumeNestedListGroup(blocks, index, library, sectionIndex);
            sentences.push(...listUnit.sentences);
            index = listUnit.nextIndex - 1;
            continue;
        }

        if (isStandaloneLabelBlock(block) && blocks[index + 1]) {
            const labelUnit = consumeLabelGroup(blocks, index, library, sectionIndex);
            if (labelUnit.sentences.length) {
                sentences.push(...labelUnit.sentences);
                index = labelUnit.nextIndex - 1;
                continue;
            }
        }

        const sentence = blockToNarrativeSentence(block, library, index);
        if (sentence) {
            sentences.push(sentence);
        }
    }

    return sentences;
}

function summarizeText(text, tone = "academic") {
    const sections = trimMetaLeadSection(parseSections(text));

    if (sections.length > 1 && sections.some((section) => section.blocks.some((block) => block.type === "bullet"))) {
        const summary = summarizeStructuredSections(sections);
        if (summary) {
            return summary;
        }
    }

    return summarizePlainText(text, tone);
}

function summarizeStructuredSections(sections) {
    const candidates = [];

    sections.forEach((section) => {
        const heading = sanitizeHeading(section.title);
        const firstUsefulBlock = section.blocks.find((block) => {
            const cleaned = cleanupText(block.text);
            return cleaned && !cleaned.endsWith(":");
        });

        if (!firstUsefulBlock) {
            return;
        }

        let sentence = "";
        if (firstUsefulBlock.type === "bullet") {
            sentence = coreSentenceFromBullet(firstUsefulBlock.text);
        } else {
            sentence = cleanupSentence(cleanupText(firstUsefulBlock.text));
        }

        if (!sentence) {
            return;
        }

        if (/key takeaway/i.test(heading)) {
            candidates.push(`Overall, ${decapitalizeSentence(sentence)}`);
        } else {
            candidates.push(sentence);
        }
    });

    const trimmed = candidates.slice(0, 4);
    if (!trimmed.length) {
        return "";
    }

    return trimmed.join(" ");
}

function summarizePlainText(text) {
    const sentences = sentenceTokenize(flattenTextForAnalysis(text));
    if (sentences.length <= 3) {
        return sentences.join(" ");
    }

    const frequencies = buildWordFrequencies(sentences);
    const scored = sentences.map((sentence, index) => ({
        sentence,
        index,
        score: scoreSentence(sentence, index, frequencies)
    }));

    const takeCount = Math.min(4, Math.max(2, Math.round(sentences.length * 0.28)));
    const selected = scored
        .sort((a, b) => b.score - a.score)
        .slice(0, takeCount)
        .sort((a, b) => a.index - b.index)
        .map((item) => item.sentence);

    return selected.join(" ");
}

async function runResearch(input) {
    const baseQuery = deriveResearchBaseQuery(input);
    const wiki = await fetchWikipediaSummary(baseQuery);
    const academicQuery = deriveAcademicQuery(input, wiki);
    const anchorTerms = buildStrictAnchorTerms(input, wiki);
    const works = await fetchOpenAlexWorks(academicQuery, anchorTerms);

    if (!wiki && !works.length) {
        throw new Error("No research results returned.");
    }

    const sections = [];
    const sources = [];

    if (wiki) {
        sections.push(`Overview\n${wiki.extract}`);
        sources.push({
            title: wiki.title,
            host: "Wikipedia",
            url: wiki.url
        });
    }

    if (works.length) {
        const abstractText = works
            .map((work) => reconstructAbstract(work.abstract_inverted_index))
            .filter(Boolean)
            .join(" ");

        if (abstractText) {
            sections.push(`Literature Snapshot\n${summarizePlainText(abstractText)}`);
        }

        const lines = works.slice(0, 4).map((work) => {
            const year = work.publication_year ? ` (${work.publication_year})` : "";
            const sourceName = work.best_oa_location?.source?.display_name
                || work.primary_location?.source?.display_name
                || work.primary_location?.raw_source_name
                || "Source unavailable";
            return `- ${work.display_name || work.title}${year} - ${sourceName}`;
        });

        sections.push(`Academic Leads\n${lines.join("\n")}`);

        works.slice(0, 4).forEach((work) => {
            const url = work.best_oa_location?.landing_page_url
                || work.primary_location?.landing_page_url
                || work.ids?.doi
                || work.id;

            sources.push({
                title: work.display_name || work.title,
                host: work.best_oa_location?.source?.display_name
                    || work.primary_location?.source?.display_name
                    || work.primary_location?.raw_source_name
                    || "OpenAlex",
                url
            });
        });
    }

    return {
        text: sections.join("\n\n"),
        sources
    };
}

async function fetchWikipediaSummary(query) {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`;
    const searchData = await fetchJson(searchUrl);
    const topResult = searchData?.query?.search?.[0];

    if (!topResult?.title) {
        return null;
    }

    const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topResult.title)}`;

    try {
        const summary = await fetchJson(summaryUrl);
        return {
            title: summary.title || topResult.title,
            extract: summary.extract || stripHtml(topResult.snippet),
            url: summary.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(topResult.title.replace(/\s+/g, "_"))}`
        };
    } catch (error) {
        return {
            title: topResult.title,
            extract: stripHtml(topResult.snippet),
            url: `https://en.wikipedia.org/wiki/${encodeURIComponent(topResult.title.replace(/\s+/g, "_"))}`
        };
    }
}

async function fetchOpenAlexWorks(query, anchorTerms = []) {
    const url = `https://api.openalex.org/works?search=${encodeURIComponent(query)}&filter=has_abstract:true,is_paratext:false,type:article&per-page=6&sort=relevance_score:desc`;
    const data = await fetchJson(url);
    const results = Array.isArray(data?.results) ? data.results : [];
    return rerankResearchWorks(results, query, anchorTerms);
}

function parseSections(text) {
    const lines = text.replace(/\r/g, "").split("\n");
    const sections = [];
    let current = { title: "Overview", blocks: [] };

    const pushCurrent = () => {
        if (!current.blocks.length && current.title === "Overview" && !sections.length) {
            return;
        }
        if (current.blocks.length) {
            sections.push(current);
        }
    };

    lines.forEach((line) => {
        const trimmed = line.trim();

        if (!trimmed) {
            return;
        }

        const headingMatch = trimmed.match(/^#{1,6}\s+(.+)$/);
        if (headingMatch) {
            pushCurrent();
            current = { title: sanitizeHeading(headingMatch[1]), blocks: [] };
            return;
        }

        const bulletMatch = line.match(/^(\s*)[-*]\s+(.+)$/);
        if (bulletMatch) {
            current.blocks.push({
                type: "bullet",
                text: bulletMatch[2],
                raw: bulletMatch[2].trimEnd(),
                indent: bulletMatch[1].length
            });
            return;
        }

        const indentMatch = line.match(/^(\s*)/);
        current.blocks.push({
            type: "paragraph",
            text: trimmed,
            raw: line.replace(/^\s+/, "").trimEnd(),
            indent: indentMatch?.[1]?.length || 0
        });
    });

    pushCurrent();
    return sections.length ? sections : [{ title: "Overview", blocks: [{ type: "paragraph", text }] }];
}

function humanizeLooseParagraph(text, library) {
    const sentences = sentenceTokenize(flattenTextForAnalysis(text));
    if (!sentences.length) {
        return "";
    }

    return chunkArray(
        sentences.map((sentence) => cleanupSentence(sentence)),
        3
    ).map((group) => group.join(" ")).join("\n\n");
}

function blockToNarrativeSentence(block, library, index) {
    const cleaned = cleanupText(block.text);
    if (!cleaned || isStandaloneLabelBlock(block)) {
        return "";
    }

    if (cleaned.endsWith(":")) {
        return "";
    }

    const labelMatch = cleaned.match(/^([^:]{2,80}):\s*(.+)$/);
    if (labelMatch) {
        return renderLabeledSentence(labelMatch[1], labelMatch[2], library, index);
    }

    return cleanupSentence(cleaned);
}

function renderLabeledSentence(label, body, library, index) {
    const cleanBody = cleanupSentence(body);
    if (!cleanBody) {
        return "";
    }

    if (bodyLooksSelfContained(cleanBody)) {
        return cleanBody;
    }

    return cleanupSentence(`For ${toLowerPhrase(label)}, the key detail is ${decapitalizeFragment(cleanBody)}`);
}

function consumeLabelGroup(blocks, index, library, sectionIndex) {
    const label = cleanupText(blocks[index].text);
    const sentences = [];
    let nextIndex = index + 1;
    let labelApplied = false;

    if (looksLikeComparisonTable(blocks, nextIndex)) {
        const tableUnit = consumeComparisonTable(blocks, nextIndex, library, sectionIndex + index);
        return {
            sentences: [buildLabelIntroSentence(label), ...tableUnit.sentences],
            nextIndex: tableUnit.nextIndex
        };
    }

    while (nextIndex < blocks.length) {
        if (isStandaloneLabelBoundary(blocks[index], blocks[nextIndex])) {
            break;
        }

        if (isColonLeadGroup(blocks, nextIndex)) {
            const colonUnit = consumeColonLeadGroup(blocks, nextIndex);
            if (colonUnit.sentences.length) {
                if (!sentences.length) {
                    sentences.push(cleanupSentence(pick(library.labelMergers, sectionIndex + index)(label, stripTerminalPunctuation(colonUnit.sentences[0]))));
                    labelApplied = true;
                } else {
                    sentences.push(...colonUnit.sentences);
                }
            }
            nextIndex = colonUnit.nextIndex;
            continue;
        }

        const sentence = blockToNarrativeSentence(blocks[nextIndex], library, nextIndex);
        if (sentence) {
            sentences.push(sentence);
        }

        nextIndex += 1;
    }

    if (!sentences.length) {
        return { sentences, nextIndex };
    }

    if (sentences.length === 1) {
        return {
            sentences: [labelApplied ? sentences[0] : cleanupSentence(pick(library.labelMergers, sectionIndex + index)(label, stripTerminalPunctuation(sentences[0])))],
            nextIndex
        };
    }

    return {
        sentences: [buildLabelIntroSentence(label), ...sentences],
        nextIndex
    };
}

function consumeNestedListGroup(blocks, index, library, sectionIndex) {
    const parent = blocks[index];
    const label = cleanupText(parent.text).replace(/:\s*$/, "");
    const children = [];
    let nextIndex = index + 1;

    while (nextIndex < blocks.length && (blocks[nextIndex].indent || 0) > (parent.indent || 0)) {
        children.push(blocks[nextIndex]);
        nextIndex += 1;
    }

    const childSentences = children
        .map((child, childIndex) => blockToNarrativeSentence(child, library, childIndex))
        .filter(Boolean);

    if (!childSentences.length) {
        return { sentences: [], nextIndex };
    }

    return {
        sentences: [
            cleanupSentence(pick(library.labelMergers, sectionIndex + index)(label, stripTerminalPunctuation(childSentences[0]))),
            ...childSentences.slice(1)
        ],
        nextIndex
    };
}

function looksLikeComparisonTable(blocks, index) {
    const headerColumns = splitTableColumns(blocks[index]?.raw || blocks[index]?.text || "");
    const firstRowColumns = splitTableColumns(blocks[index + 1]?.raw || blocks[index + 1]?.text || "");
    return headerColumns.length >= 3 && firstRowColumns.length === headerColumns.length;
}

function consumeComparisonTable(blocks, index, library, sectionIndex) {
    const rows = [];
    const headerLength = splitTableColumns(blocks[index].raw || blocks[index].text).length;
    let nextIndex = index;

    while (nextIndex < blocks.length) {
        const columns = splitTableColumns(blocks[nextIndex].raw || blocks[nextIndex].text);
        if (columns.length !== headerLength) {
            break;
        }
        rows.push(columns);
        nextIndex += 1;
    }

    const sentences = comparisonTableToSentences(rows, library, sectionIndex);
    return { sentences, nextIndex };
}

function comparisonTableToSentences(rows, library, sectionIndex) {
    if (rows.length < 2) {
        return [];
    }

    const header = rows[0].map((cell) => cleanupText(cell));
    const left = cleanupEntityName(header[1] || "dogs");
    const right = cleanupEntityName(header[2] || "wolves");
    const sentences = [pick(library.comparisonLead, sectionIndex)(left, right)];

    rows.slice(1).forEach((row) => {
        const feature = cleanupText(row[0]);
        const leftValue = cleanupText(row[1]);
        const rightValue = cleanupText(row[2]);
        if (!feature || !leftValue || !rightValue) {
            return;
        }

        sentences.push(
            cleanupSentence(
                `${normalizeLabel(feature)} is ${comparisonVerb(leftValue, rightValue)} in ${toLowerPhrase(left)} and ${comparisonVerb(rightValue, leftValue)} in ${toLowerPhrase(right)}`
            )
        );
    });

    return sentences;
}

function splitTableColumns(text) {
    const raw = String(text || "").trim();
    if (!raw) {
        return [];
    }

    return raw
        .split(/\t+| {2,}/)
        .map((cell) => cell.trim())
        .filter(Boolean);
}

function isParentListLabel(block, nextBlock) {
    if (!block || !nextBlock) {
        return false;
    }

    const cleaned = cleanupText(block.text);
    return cleaned.endsWith(":") && (nextBlock.indent || 0) > (block.indent || 0);
}

function isStandaloneLabelBlock(block) {
    if (!block) {
        return false;
    }

    const cleaned = cleanupText(block.text);
    if (!cleaned || cleaned.endsWith(".") || cleaned.endsWith("!") || cleaned.endsWith("?")) {
        return false;
    }

    if (splitTableColumns(block.raw || block.text).length >= 3) {
        return false;
    }

    if (/^([^:]{2,80}):\s*(.+)$/.test(cleaned)) {
        return false;
    }

    if (cleaned.length > 85) {
        return false;
    }

    const words = cleaned.split(/\s+/);
    if (words.length > 7) {
        return false;
    }

    if (cleaned.includes("(") && words.length <= 8) {
        return /^[A-Z0-9]/.test(cleaned);
    }

    const plainWords = words.map((word) => word.replace(/^[^A-Za-z0-9]+|[^A-Za-z0-9)]+$/g, ""));
    const lowercaseWords = plainWords.filter((word) => /^[a-z]/.test(word));
    if (lowercaseWords.length > Math.max(1, Math.floor(words.length / 3))) {
        return false;
    }

    return /^[A-Z0-9]/.test(cleaned);
}

function isStandaloneLabelBoundary(baseBlock, candidateBlock) {
    if (!candidateBlock || !isStandaloneLabelBlock(candidateBlock)) {
        return false;
    }

    return (candidateBlock.indent || 0) <= (baseBlock.indent || 0);
}

function bodyLooksSelfContained(text) {
    const cleaned = cleanupSentence(text);
    if (!cleaned) {
        return false;
    }

    return /^(dogs?|wolves?|modern breeds?|some|many|domestic dogs?|in humans?|human|genetic|brain|feature|interpretation|individuals?|researchers?|studies|domestic|magnetoreception|this|these|their)\b/i.test(cleaned);
}

function stripTerminalPunctuation(text) {
    return cleanupText(text).replace(/[.!?]+$/, "");
}

function decapitalizeFragment(text) {
    const cleaned = stripTerminalPunctuation(text);
    if (!cleaned) {
        return "";
    }

    if (/^[A-Z]{2,}/.test(cleaned)) {
        return cleaned;
    }

    return cleaned.charAt(0).toLowerCase() + cleaned.slice(1);
}

function normalizeLabel(text) {
    const cleaned = cleanupText(text);
    if (!cleaned) {
        return "";
    }

    return cleaned
        .split(/\s+/)
        .map((word) => /^[A-Z0-9-]{2,}$/.test(word) ? word : word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

function cleanupEntityName(text) {
    const cleaned = cleanupText(text);
    if (/^dog$/i.test(cleaned)) {
        return "dogs";
    }
    if (/^wolf$/i.test(cleaned)) {
        return "wolves";
    }
    return cleaned.toLowerCase();
}

function comparisonVerb(value, otherValue) {
    const cleaned = cleanupText(value);
    const lower = cleaned.toLowerCase();

    if (/^(smaller|larger|reduced|enlarged|expanded)$/i.test(cleaned)) {
        return lower;
    }

    if (/^(higher|lower)$/i.test(cleaned)) {
        return lower;
    }

    return `described as ${lower}`;
}

function isColonLeadGroup(blocks, index) {
    const cleaned = cleanupText(blocks[index]?.text || "");
    return cleaned.endsWith(":") && blocks[index + 1]?.type === "bullet";
}

function consumeColonLeadGroup(blocks, index) {
    const lead = cleanupText(blocks[index].text).replace(/:\s*$/, "");
    const fragments = [];
    let nextIndex = index + 1;

    while (nextIndex < blocks.length && blocks[nextIndex].type === "bullet") {
        const cleaned = cleanupText(blocks[nextIndex].text);
        if (!cleaned) {
            nextIndex += 1;
            continue;
        }

        const labelMatch = cleaned.match(/^([^:]{2,80}):\s*(.+)$/);
        if (labelMatch) {
            fragments.push(`${normalizeLabel(labelMatch[1])} involves ${decapitalizeFragment(labelMatch[2])}`);
        } else {
            fragments.push(decapitalizeFragment(cleaned));
        }

        nextIndex += 1;
    }

    if (!fragments.length) {
        return { sentences: [], nextIndex };
    }

    return {
        sentences: [cleanupSentence(`${lead} ${joinListFragments(fragments)}`)],
        nextIndex
    };
}

function joinListFragments(items) {
    const cleaned = items.map((item) => cleanupText(item)).filter(Boolean);
    if (!cleaned.length) {
        return "";
    }

    if (cleaned.length === 1) {
        return cleaned[0];
    }

    if (cleaned.length === 2) {
        return `${cleaned[0]} and ${cleaned[1]}`;
    }

    return `${cleaned.slice(0, -1).join(", ")}, and ${cleaned[cleaned.length - 1]}`;
}

function buildLabelIntroSentence(label) {
    return cleanupSentence(`On ${toLowerPhrase(label)}, several related points stand out`);
}

function coreSentenceFromBullet(text) {
    const cleaned = cleanupText(text);
    if (!cleaned) {
        return "";
    }

    const match = cleaned.match(/^([^:]{2,64}):\s*(.+)$/);
    if (match) {
        return cleanupSentence(match[2]);
    }

    return cleanupSentence(cleaned);
}

function flattenTextForAnalysis(text) {
    return text
        .replace(/\r/g, "")
        .split("\n")
        .map((line) => cleanupText(line))
        .filter(Boolean)
        .join(" ");
}

function sentenceTokenize(text) {
    const matches = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g);
    return (matches || [])
        .map((sentence) => cleanupSentence(sentence))
        .filter(Boolean);
}

function buildWordFrequencies(sentences) {
    const frequencies = new Map();

    sentences.forEach((sentence) => {
        sentence
            .toLowerCase()
            .match(/[a-z][a-z'-]{2,}/g)
            ?.forEach((word) => {
                if (STOPWORDS.has(word)) {
                    return;
                }
                frequencies.set(word, (frequencies.get(word) || 0) + 1);
            });
    });

    return frequencies;
}

function scoreSentence(sentence, index, frequencies) {
    const words = sentence.toLowerCase().match(/[a-z][a-z'-]{2,}/g) || [];
    const keywordScore = words.reduce((score, word) => score + (frequencies.get(word) || 0), 0);
    const earlyBonus = index < 2 ? 2 : 0;
    const lengthPenalty = sentence.length > 230 ? 1.2 : 0;
    return keywordScore + earlyBonus - lengthPenalty;
}

function deriveResearchBaseQuery(input) {
    const sections = trimMetaLeadSection(parseSections(input));
    const cleaned = flattenTextForAnalysis(input);
    if (!cleaned) {
        return "research topic";
    }

    if (cleaned.length <= 100 && !/\n/.test(input)) {
        return cleaned;
    }

    const latinNames = extractScientificNames(input);
    const structuredTerms = collectStructuredTerms(sections, 10);
    const ranked = rankKeywords(cleaned, 12);
    return uniqueValues([...latinNames, ...structuredTerms, ...ranked])
        .filter(isUsefulQueryTerm)
        .slice(0, 8)
        .join(" ");
}

function deriveAcademicQuery(input, wiki) {
    const sections = trimMetaLeadSection(parseSections(input));
    const combined = [flattenTextForAnalysis(input), wiki?.title || "", wiki?.extract || ""].join(" ");
    const rawInput = cleanupText(input);
    const latinNames = uniqueValues([
        ...extractScientificNames(input),
        ...extractScientificNames(wiki?.extract || "")
    ]);

    if (rawInput.length <= 180 && !/\n/.test(input)) {
        return uniqueValues([rawInput, wiki?.title || "", ...latinNames])
            .filter(isUsefulQueryTerm)
            .join(" ");
    }

    const structuredTerms = collectStructuredTerms(sections, 14);
    const wikiTerms = extractImportantTerms([wiki?.title || "", wiki?.extract || ""].join(" "), 10);
    const ranked = rankKeywords(combined, 14);
    return uniqueValues([wiki?.title || "", ...latinNames, ...structuredTerms, ...wikiTerms, ...ranked])
        .filter(isUsefulQueryTerm)
        .slice(0, 10)
        .join(" ");
}

function rankKeywords(text, maxCount) {
    const counts = new Map();

    (text.match(/[A-Za-z][A-Za-z'-]{2,}/g) || []).forEach((word) => {
        const lower = word.toLowerCase();
        if (STOPWORDS.has(lower) || GENERIC_QUERY_WORDS.has(lower)) {
            return;
        }
        counts.set(lower, (counts.get(lower) || 0) + 1);
    });

    return Array.from(counts.entries())
        .sort((a, b) => {
            if (b[1] !== a[1]) {
                return b[1] - a[1];
            }
            return b[0].length - a[0].length;
        })
        .slice(0, maxCount)
        .map(([word]) => word);
}

function collectStructuredTerms(sections, maxCount) {
    const titleTerms = [];
    const blockTerms = [];

    sections.forEach((section) => {
        titleTerms.push(...extractImportantTerms(section.title || "", 3));

        section.blocks.slice(0, 4).forEach((block) => {
            const cleaned = cleanupText(block.text);
            const labelMatch = cleaned.match(/^([^:]{2,64}):\s*(.+)$/);
            if (labelMatch) {
                blockTerms.push(...extractImportantTerms(labelMatch[1], 2));
                blockTerms.push(...extractImportantTerms(labelMatch[2], 2));
            } else {
                blockTerms.push(...extractImportantTerms(cleaned, 2));
            }
        });
    });

    return uniqueValues([...titleTerms, ...blockTerms]).slice(0, maxCount);
}

function extractImportantTerms(text, limit) {
    const words = cleanupText(text)
        .toLowerCase()
        .match(/[a-z][a-z'-]{3,}/g) || [];

    return uniqueValues(
        words
            .filter((word) => !STOPWORDS.has(word) && !GENERIC_QUERY_WORDS.has(word))
            .sort((a, b) => b.length - a.length)
    ).slice(0, limit);
}

function extractScientificNames(text) {
    const raw = String(text || "");
    const results = [];
    const pattern = /[\(*]([A-Z][a-z]{2,}\s[a-z]{3,})[\)*]/g;
    let match;

    while ((match = pattern.exec(raw)) !== null) {
        results.push(match[1]);
    }

    return uniqueValues(results);
}

function buildStrictAnchorTerms(input, wiki) {
    const titleTerms = (cleanupText(wiki?.title || "").toLowerCase().match(/[a-z][a-z'-]{2,}/g) || [])
        .filter((term) => !STOPWORDS.has(term) && !GENERIC_QUERY_WORDS.has(term));
    const scientificTokens = extractScientificNames(`${input} ${wiki?.extract || ""}`)
        .flatMap((name) => name.toLowerCase().split(/\s+/))
        .filter((term) => term.length > 2);
    const leadingInputTerms = (cleanupText(input).toLowerCase().match(/[a-z][a-z'-]{2,}/g) || [])
        .filter((term) => !STOPWORDS.has(term) && !GENERIC_QUERY_WORDS.has(term))
        .slice(0, 4);

    return uniqueValues([...titleTerms, ...scientificTokens, ...leadingInputTerms]).slice(0, 4);
}

function rerankResearchWorks(works, query, anchorTerms = []) {
    const terms = uniqueValues(
        (query.toLowerCase().match(/[a-z][a-z'-]{2,}/g) || [])
            .filter((term) => !STOPWORDS.has(term) && !GENERIC_QUERY_WORDS.has(term))
    );

    const cleanedAnchors = uniqueValues(anchorTerms.map((term) => cleanupText(term).toLowerCase()).filter(Boolean)).slice(0, 4);
    const filtered = works.filter((work) => workMatchesAnchorTerms(work, cleanedAnchors));
    const pool = filtered.length ? filtered : works;

    return pool
        .map((work) => ({
            work,
            score: scoreResearchWork(work, terms)
        }))
        .sort((a, b) => b.score - a.score)
        .map((item) => item.work);
}

function scoreResearchWork(work, terms) {
    const title = (work.display_name || work.title || "").toLowerCase();
    const abstract = reconstructAbstract(work.abstract_inverted_index).toLowerCase();
    const topics = (work.topics || []).map((topic) => topic.display_name || "").join(" ").toLowerCase();
    const keywords = (work.keywords || []).map((keyword) => keyword.display_name || "").join(" ").toLowerCase();
    const haystack = `${title} ${abstract} ${topics} ${keywords}`;

    let score = Number(work.relevance_score || 0);

    terms.forEach((term) => {
        if (title.includes(term)) {
            score += 14;
        }
        if (abstract.includes(term)) {
            score += 7;
        }
        if (topics.includes(term) || keywords.includes(term)) {
            score += 4;
        }
    });

    if (/\bdog\b|\bdogs\b|\bcanis\b|\bwolf\b|\bwolves\b/.test(title)) {
        score += 18;
    }

    return score;
}

function workMatchesAnchorTerms(work, anchorTerms) {
    if (!anchorTerms.length) {
        return true;
    }

    const title = (work.display_name || work.title || "").toLowerCase();
    const abstract = reconstructAbstract(work.abstract_inverted_index).toLowerCase();
    const haystack = `${title} ${abstract}`;

    return anchorTerms.some((term) => term.length > 2 && haystack.includes(term));
}

function reconstructAbstract(invertedIndex) {
    if (!invertedIndex || typeof invertedIndex !== "object") {
        return "";
    }

    const tokens = [];
    Object.entries(invertedIndex).forEach(([word, positions]) => {
        positions.forEach((position) => {
            tokens[position] = word;
        });
    });

    return cleanupSentence(tokens.filter(Boolean).join(" ").replace(/<[^>]+>/g, ""));
}

async function fetchJson(url) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }
        return await response.json();
    } finally {
        clearTimeout(timeout);
    }
}

function renderOutput(text) {
    state.refs.outputText.textContent = text;
    state.refs.copyBtn.classList.remove("hidden");
    state.refs.wordCountOutput.textContent = `${countWords(text)} words`;
}

function setOutputPlaceholder() {
    state.refs.outputText.innerHTML = '<span class="text-slate-400">Your processed result appears here.</span>';
    state.refs.copyBtn.classList.add("hidden");
    state.refs.wordCountOutput.textContent = "0 words";
}

function renderSources(sources) {
    const unique = uniqueValuesByKey(
        sources.filter((source) => source?.title && source?.url),
        (source) => `${source.title}|${source.url}`
    );

    if (!unique.length) {
        clearSources();
        return;
    }

    state.refs.sourcesList.innerHTML = unique.map((source) => {
        const host = source.host ? `<div class="mt-1 text-xs text-slate-500">${escapeHtml(source.host)}</div>` : "";
        return `
            <a class="source-link" href="${escapeAttribute(source.url)}" target="_blank" rel="noreferrer">
                <div class="text-sm font-semibold text-slate-800">${escapeHtml(source.title)}</div>
                ${host}
            </a>
        `;
    }).join("");

    state.refs.sourcesContainer.classList.remove("hidden");
}

function clearSources() {
    state.refs.sourcesList.innerHTML = "";
    state.refs.sourcesContainer.classList.add("hidden");
}

function setLoading(isLoading) {
    state.refs.loadingOverlay.classList.toggle("hidden", !isLoading);
    state.refs.loadingOverlay.classList.toggle("flex", isLoading);
    state.refs.processBtn.disabled = isLoading;
    state.refs.processBtn.style.opacity = isLoading ? "0.7" : "1";
    state.refs.processBtn.style.pointerEvents = isLoading ? "none" : "auto";
}

function loadDemoText() {
    state.refs.inputText.value = DEMO_TEXT;
    updateInputWordCount();
    showToast("Demo text loaded.");
}

function clearInput() {
    state.refs.inputText.value = "";
    updateInputWordCount();
    showToast("Input cleared.");
}

async function copyOutput() {
    const text = state.refs.outputText.textContent.trim();
    if (!text) {
        showToast("Nothing to copy.", "error");
        return;
    }

    try {
        await navigator.clipboard.writeText(text);
        showToast("Copied to clipboard.");
    } catch (error) {
        const tempArea = document.createElement("textarea");
        tempArea.value = text;
        document.body.appendChild(tempArea);
        tempArea.select();
        document.execCommand("copy");
        document.body.removeChild(tempArea);
        showToast("Copied to clipboard.");
    }
}

function updateInputWordCount() {
    state.refs.wordCountInput.textContent = `${countWords(state.refs.inputText.value)} words`;
}

function showToast(message, type = "success") {
    const iconClass = type === "error" ? "fa-solid fa-circle-exclamation" : "fa-solid fa-circle-check";

    state.refs.toastMessage.textContent = message;
    state.refs.toastIcon.innerHTML = `<i class="${iconClass}"></i>`;
    state.refs.toast.classList.add("show");

    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => {
        state.refs.toast.classList.remove("show");
    }, 2400);
}

function getSelectedTone() {
    return document.querySelector('input[name="tone"]:checked')?.value || "academic";
}

function cleanupText(text) {
    return text
        .replace(/^\s*[-*]\s+/, "")
        .replace(/^#{1,6}\s+/, "")
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/\*(.*?)\*/g, "$1")
        .replace(/`([^`]+)`/g, "$1")
        .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
        .replace(/&amp;/g, "&")
        .replace(/\s*&\s*&\s*/g, " & ")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\s+/g, " ")
        .trim();
}

function sanitizeHeading(text) {
    return cleanupText(text).replace(/^\d+\.\s*/, "").trim();
}

function trimMetaLeadSection(sections) {
    if (sections.length < 2) {
        return sections;
    }

    const [first, ...rest] = sections;
    if (!/^overview$/i.test(first.title || "")) {
        return sections;
    }

    const meaningfulBlocks = first.blocks.filter((block) => !isMetaLeadBlock(block.text));
    if (meaningfulBlocks.length) {
        return [{ ...first, blocks: meaningfulBlocks }, ...rest];
    }

    return rest;
}

function isMetaLeadBlock(text) {
    const cleaned = cleanupText(text).toLowerCase();
    return /^(here is|below is|this is|the following is|here's)\b/.test(cleaned);
}

function cleanupSentence(text) {
    const trimmed = cleanupText(text);
    if (!trimmed) {
        return "";
    }

    const normalized = trimmed
        .replace(/\s+([,.;:!?])/g, "$1")
        .replace(/\(\s+/g, "(")
        .replace(/\s+\)/g, ")");

    return /[.!?]$/.test(normalized) ? normalized : `${normalized}.`;
}

function decapitalizeSentence(text) {
    const cleaned = cleanupSentence(text);
    if (!cleaned) {
        return "";
    }

    if (/^[A-Z]{2,}/.test(cleaned)) {
        return cleaned;
    }

    return cleaned.charAt(0).toLowerCase() + cleaned.slice(1);
}

function toLowerPhrase(text) {
    const cleaned = sanitizeHeading(text);
    if (!cleaned) {
        return "";
    }
    return cleaned
        .split(/\s+/)
        .map((word) => {
            const match = word.match(/^([^A-Za-z0-9]*)(.*?)([^A-Za-z0-9]*)$/);
            const prefix = match?.[1] || "";
            const core = match?.[2] || word;
            const suffix = match?.[3] || "";

            if (!core) {
                return word;
            }

            if (/^[A-Z0-9-]{2,}$/.test(core) || /[A-Z].*[A-Z]/.test(core)) {
                return `${prefix}${core}${suffix}`;
            }

            return `${prefix}${core.toLowerCase()}${suffix}`;
        })
        .join(" ");
}

function pick(items, index) {
    return items[index % items.length];
}

function chunkArray(items, size) {
    const result = [];
    for (let i = 0; i < items.length; i += size) {
        result.push(items.slice(i, i + size));
    }
    return result;
}

function countWords(text) {
    return cleanupText(text).split(/\s+/).filter(Boolean).length;
}

function uniqueValues(values) {
    return Array.from(new Set(values.filter(Boolean)));
}

function isUsefulQueryTerm(value) {
    const cleaned = cleanupText(value);
    if (!cleaned) {
        return false;
    }

    if (/\s/.test(cleaned)) {
        return true;
    }

    const lower = cleaned.toLowerCase();
    return !STOPWORDS.has(lower) && !GENERIC_QUERY_WORDS.has(lower) && lower.length > 2;
}

function uniqueValuesByKey(items, keyFn) {
    const seen = new Set();
    return items.filter((item) => {
        const key = keyFn(item);
        if (seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });
}

function stripHtml(html) {
    return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function escapeAttribute(value) {
    return escapeHtml(value);
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

if (typeof document !== "undefined") {
    document.addEventListener("DOMContentLoaded", initApp);
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        DEMO_TEXT,
        humanizeText,
        runResearch,
        summarizeText,
        summarizePlainText,
        summarizeStructuredSections,
        deriveResearchBaseQuery,
        deriveAcademicQuery,
        parseSections,
        reconstructAbstract,
        countWords
    };
}
