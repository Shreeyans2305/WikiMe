import React, { useState } from "react";

const DEFAULT_DATA = {
  name: "Socrates",
  subtitle: "The Ancient Greek Philosopher",
  imageUrl:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Socrates.png/250px-Socrates.png",
  imageCaption: "Bust of Socrates, Roman copy after a Greek original",
  born: "470 BC, Alopeke, Athens",
  died: "399 BC (aged ~71), Athens",
  occupation: "Philosopher",
  spouse: "Xanthippe",
  children: ["Lamprocles", "Sophroniscus", "Menexenus"],
  nationality: "Greek",
  lead: `Socrates (470–399 BC) was a classical Greek philosopher credited as one of the founders of Western philosophy. He is known for the Socratic method.`,
  sections: {
    earlyLife: `Born in Alopeke, a deme of Athens, Socrates was the son of Sophroniscus, a stonemason, and Phaenarete, a midwife.`,
    marriageAndChildren: `Socrates married Xanthippe, who bore him three sons.`,
    death: `In 399 BC, Socrates was tried and sentenced to death by hemlock poisoning.`,
    philosophy: `Socrates held that virtue is knowledge and that wrongdoing arises from ignorance.`,
    publishedWorks: `Socrates wrote nothing. His philosophy survives through the dialogues of Plato.`,
    recognition: `Socrates was posthumously recognised as the founding figure of Western moral philosophy.`,
  },
  references: [],
  seeAlso: ["Plato", "Aristotle", "Socratic method"],
  externalLinks: [],
  categories: ["Ancient Greek philosophers", "Classical Athens"],
  lastEdited: "March 15, 2026",
};

function Disclaimer() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  return (
    <div style={styles.disclaimer}>
      <span style={styles.disclaimerIcon}>⚠</span>
      <span style={styles.disclaimerText}>
        <strong>Notice:</strong> This page was created by a user and has not
        been fact-checked or verified by any editor. Information may be
        inaccurate, incomplete, or entirely fictional. Do not rely on it as a
        factual source.
      </span>
      <button
        style={styles.disclaimerClose}
        onClick={() => setDismissed(true)}
        title="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}

function InfoBox({ data }) {
  const imageSrc = data.imageUrl || null;

  return (
    <table style={styles.infobox}>
      <tbody>
        <tr>
          <th colSpan={2} style={styles.infoboxAbove}>
            <div>{data.name}</div>
            {data.subtitle && (
              <div
                style={{ fontSize: "90%", fontWeight: "normal", marginTop: 4 }}
              >
                {data.subtitle}
              </div>
            )}
          </th>
        </tr>
        {imageSrc && (
          <tr>
            <td colSpan={2} style={{ textAlign: "center", padding: "8px" }}>
              <img
                src={imageSrc}
                alt={data.name}
                width={200}
                style={{ maxWidth: "100%" }}
              />
              {data.imageCaption && (
                <div style={styles.infoboxCaption}>{data.imageCaption}</div>
              )}
            </td>
          </tr>
        )}
        {[
          ["Born", data.born],
          ["Died", data.died],
          ["Occupation", data.occupation],
          ["Nationality", data.nationality],
          ["Spouse", data.spouse],
        ]
          .filter(([, val]) => val)
          .map(([label, value]) => (
            <tr key={label}>
              <th scope="row" style={styles.infoboxLabel}>
                {label}
              </th>
              <td style={styles.infoboxData}>{value}</td>
            </tr>
          ))}
        {data.children?.length > 0 && (
          <tr>
            <th scope="row" style={styles.infoboxLabel}>
              Children
            </th>
            <td style={styles.infoboxData}>
              {Array.isArray(data.children)
                ? data.children.join(", ")
                : data.children}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

function SectionHeading({ id, level = 2, children }) {
  const Tag = `h${level}`;
  return (
    <div style={styles.headingWrapper}>
      <Tag id={id} style={level === 2 ? styles.h2 : styles.h3}>
        {children}
      </Tag>
    </div>
  );
}

function TableOfContents({ sections }) {
  const visible = sections.filter((s) => s.content);
  if (visible.length === 0) return null;
  return (
    <div style={styles.toc}>
      <div style={styles.tocTitle}>Contents</div>
      <ol style={styles.tocList}>
        {visible.map((s, i) => (
          <li key={s.id} style={styles.tocItem}>
            <a href={`#${s.id}`} style={styles.tocLink}>
              <span style={styles.tocNumber}>{i + 1}</span> {s.label}
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}

const WikiTemplate = ({ data: propData }) => {
  const d = propData || DEFAULT_DATA;
  const isUserGenerated = !!propData;

  const tocSections = [
    { id: "Early_life", label: "Early life", content: d.sections?.earlyLife },
    {
      id: "Personal_life",
      label: "Personal life",
      content: d.sections?.marriageAndChildren,
    },
    { id: "Death", label: "Death", content: d.sections?.death },
    {
      id: "Philosophy",
      label: "Philosophy / Approach",
      content: d.sections?.philosophy,
    },
    {
      id: "Works",
      label: "Works & achievements",
      content: d.sections?.publishedWorks,
    },
    {
      id: "Recognition",
      label: "Recognition",
      content: d.sections?.recognition,
    },
    {
      id: "See_also",
      label: "See also",
      content: d.seeAlso?.length > 0 ? true : null,
    },
    {
      id: "References",
      label: "References",
      content: d.references?.length > 0 ? true : null,
    },
  ];

  return (
    <div style={styles.pageWrapper}>
      {isUserGenerated && <Disclaimer />}

      <header style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>
          <span style={styles.pageTitleMain}>{d.name}</span>
        </h1>
        <div style={styles.toolbar}>
          <span style={styles.lastEdited}>Last edited: {d.lastEdited}</span>
        </div>
      </header>

      <div style={styles.bodyContent}>
        <div style={styles.leadSection}>
          <InfoBox data={d} />
          {d.lead && (
            <p style={styles.leadText}>
              <strong>{d.name}</strong> {d.lead}
            </p>
          )}
          <TableOfContents sections={tocSections} />
        </div>

        {d.sections?.earlyLife && (
          <>
            <SectionHeading id="Early_life">Early life</SectionHeading>
            <p style={styles.p}>{d.sections.earlyLife}</p>
          </>
        )}
        {d.sections?.marriageAndChildren && (
          <>
            <SectionHeading id="Personal_life">Personal life</SectionHeading>
            <p style={styles.p}>{d.sections.marriageAndChildren}</p>
          </>
        )}
        {d.sections?.death && (
          <>
            <SectionHeading id="Death">Death</SectionHeading>
            <p style={styles.p}>{d.sections.death}</p>
          </>
        )}
        {d.sections?.philosophy && (
          <>
            <SectionHeading id="Philosophy">
              Philosophy / Approach
            </SectionHeading>
            <p style={styles.p}>{d.sections.philosophy}</p>
          </>
        )}
        {d.sections?.publishedWorks && (
          <>
            <SectionHeading id="Works">Works &amp; achievements</SectionHeading>
            <p style={styles.p}>{d.sections.publishedWorks}</p>
          </>
        )}
        {d.sections?.recognition && (
          <>
            <SectionHeading id="Recognition">Recognition</SectionHeading>
            <p style={styles.p}>{d.sections.recognition}</p>
          </>
        )}

        {d.seeAlso?.length > 0 && (
          <>
            <SectionHeading id="See_also">See also</SectionHeading>
            <ul style={styles.ul}>
              {d.seeAlso.map((item) => (
                <li key={item} style={styles.li}>
                  {item}
                </li>
              ))}
            </ul>
          </>
        )}
        {d.references?.length > 0 && (
          <>
            <SectionHeading id="References">References</SectionHeading>
            <ol style={styles.refList}>
              {d.references.map((ref, i) => (
                <li key={i} style={styles.refItem}>
                  {ref.url ? (
                    <a
                      href={ref.url}
                      style={styles.link}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {ref.label || ref.url}
                    </a>
                  ) : (
                    ref.label || ref.text || ref
                  )}
                </li>
              ))}
            </ol>
          </>
        )}
        {d.externalLinks?.length > 0 && (
          <>
            <SectionHeading id="External_links">External links</SectionHeading>
            <ul style={styles.ul}>
              {d.externalLinks.map((link) => (
                <li key={link.href || link} style={styles.li}>
                  <a
                    href={link.href || link}
                    style={styles.link}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {link.label || link.href || link}
                  </a>
                </li>
              ))}
            </ul>
          </>
        )}

        {d.categories?.length > 0 && (
          <div style={styles.catLinks}>
            <strong>Categories:</strong> {d.categories.join(" · ")}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  disclaimer: {
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
    background: "#fef9e7",
    border: "1px solid #f0c040",
    borderLeft: "4px solid #f0c040",
    borderRadius: 4,
    padding: "10px 14px",
    margin: "0 0 12px 0",
    fontSize: 13,
    lineHeight: 1.5,
    color: "#5a4a00",
    fontFamily: "Linux Libertine, Georgia, Times, serif",
    position: "relative",
  },
  disclaimerIcon: { fontSize: 15, flexShrink: 0, marginTop: 1 },
  disclaimerText: { flex: 1 },
  disclaimerClose: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#a08800",
    fontSize: 14,
    padding: "0 0 0 8px",
    lineHeight: 1,
    flexShrink: 0,
    alignSelf: "flex-start",
  },
  pageWrapper: {
    fontFamily: "Linux Libertine, Georgia, Times, serif",
    fontSize: "14px",
    lineHeight: "1.6",
    color: "#202122",
    backgroundColor: "#fff",
    maxWidth: "960px",
    margin: "0 auto",
    padding: "12px 16px 48px",
    minHeight: "calc(100vh - 41px)",
    boxSizing: "border-box",
  },
  pageHeader: {
    borderBottom: "1px solid #a2a9b1",
    paddingBottom: "4px",
    marginBottom: "8px",
  },
  pageTitle: {
    fontFamily: "Linux Libertine, Georgia, Times, serif",
    fontSize: "28px",
    fontWeight: "normal",
    margin: "0 0 4px 0",
    padding: 0,
  },
  pageTitleMain: { color: "#000" },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    fontSize: "12px",
    color: "#72777d",
    borderTop: "1px solid #a2a9b1",
    paddingTop: "4px",
  },
  lastEdited: { fontSize: "12px", color: "#72777d" },
  bodyContent: { padding: "8px 0", overflow: "hidden" },
  leadSection: { overflow: "hidden" },
  infobox: {
    float: "right",
    clear: "right",
    margin: "0 0 16px 24px",
    padding: "4px",
    border: "1px solid #a2a9b1",
    backgroundColor: "#f8f9fa",
    fontSize: "88%",
    lineHeight: "1.5em",
    width: "22em",
    borderCollapse: "collapse",
  },
  infoboxAbove: {
    textAlign: "center",
    fontSize: "125%",
    fontWeight: "bold",
    backgroundColor: "#cee0f2",
    padding: "8px",
  },
  infoboxCaption: {
    textAlign: "center",
    fontSize: "88%",
    color: "#54595d",
    marginTop: "4px",
  },
  infoboxLabel: {
    verticalAlign: "top",
    textAlign: "right",
    fontWeight: "bold",
    padding: "4px 8px",
    whiteSpace: "nowrap",
    width: "40%",
  },
  infoboxData: { verticalAlign: "top", padding: "4px 8px" },
  toc: {
    display: "inline-block",
    border: "1px solid #a2a9b1",
    backgroundColor: "#f8f9fa",
    padding: "12px 20px",
    marginBottom: "8px",
    minWidth: "200px",
  },
  tocTitle: { textAlign: "center", fontWeight: "bold", marginBottom: "8px" },
  tocList: { margin: 0, padding: "0 0 0 20px" },
  tocItem: { marginBottom: "4px", fontSize: "13px" },
  tocLink: { color: "#0645ad", textDecoration: "none" },
  tocNumber: { color: "#54595d", marginRight: "4px" },
  headingWrapper: {
    borderBottom: "1px solid #a2a9b1",
    marginBottom: "4px",
    marginTop: "16px",
  },
  h2: {
    fontFamily: "Linux Libertine, Georgia, Times, serif",
    fontSize: "22px",
    fontWeight: "normal",
    margin: "0 0 4px 0",
    padding: 0,
  },
  h3: {
    fontFamily: "Linux Libertine, Georgia, Times, serif",
    fontSize: "17px",
    fontWeight: "bold",
    margin: "14px 0 4px 0",
    padding: 0,
  },
  leadText: { margin: "0 0 6px 0", lineHeight: "1.7" },
  p: { margin: "8px 0", lineHeight: "1.7" },
  ul: { paddingLeft: "24px", margin: "8px 0" },
  li: { marginBottom: "4px" },
  link: { color: "#0645ad", textDecoration: "none" },
  refList: { paddingLeft: "28px", fontSize: "13px", lineHeight: "1.6" },
  refItem: { marginBottom: "6px" },
  catLinks: {
    borderTop: "1px solid #a2a9b1",
    padding: "8px 0",
    marginTop: "24px",
    fontSize: "13px",
  },
};

export default WikiTemplate;
