import React from 'react';

// Sample preview data for the homepage cards
const PREVIEW_DATA = [
  {
    name: 'Grandma',
    subtitle: 'Matriarch, Cookie Industrialist & Remote Control Hoarder',
    born: 'Sometime before television, The Old Country',
    died: '',
    occupation: 'Retired Everything, Full-time Worrier',
    nationality: 'Proudly unclear',
    imageUrl: '/grandma.png',
    lead: 'Grandma is a highly influential figure known for her unmatched casserole diplomacy, the ability to pinch cheeks at supersonic speed, and an encyclopedic memory for every mistake you\'ve ever made. She has never once correctly operated a smartphone but maintains three Facebook accounts.',
    tags: ['Legend', 'Cuisine', 'Unsolicited Advice'],
  },
  {
    name: 'Jason',
    subtitle: 'Friend, Chronic Group Chat Ignorer & Part-Time Philosopher',
    born: 'Late, as usual',
    died: '',
    occupation: 'Aspiring Something, Currently Between Ideas',
    nationality: 'Local',
    imageUrl: '/jason.jpg',
    lead: 'Jason is a polarising figure best known for his three-hour response time to simple yes/no questions, an inexplicable confidence in his own cooking, and a deeply held belief that he "could go pro" at any sport he has tried exactly once. Considered a loyal companion when located.',
    tags: ['Friend', 'Flaky', 'Surprisingly Wise'],
  },
  {
    name: 'Skawlee',
    subtitle: 'Cat, Chaos Agent & Certified Sleep Disruptor',
    born: 'The shelter, under mysterious circumstances',
    died: '',
    occupation: 'Professional Napper, Amateur Knocker-Off-Of-Things',
    nationality: 'Domestic Shorthair (disputed)',
    imageUrl: '/skawlee.png',
    lead: 'Skawlee is a domestic cat of unknown origin and unknowable motive. Scholars debate whether her 3am sprinting episodes constitute performance art or psychological warfare. She has never once sat on the expensive cat bed and shows no remorse. Her stare has been described as "ancient and judgemental."',
    tags: ['Cat', 'Menace', 'Beloved'],
  },
  {
    name: 'Nora',
    subtitle: 'Friend, Over-Thinker & Yelp Review Auteur',
    born: 'A Tuesday, reportedly',
    died: '',
    occupation: 'Professional Opinion Haver, Brunch Coordinator',
    nationality: 'Cosmopolitan',
    imageUrl: '/nora.jpg',
    lead: 'Nora is a close associate widely regarded as the group\'s moral compass, primary trip planner, and most reliable source of unsolicited restaurant recommendations. She has strong feelings about font choices, has read the terms and conditions at least twice, and will absolutely make you a personalised playlist whether you asked for one or not.',
    tags: ['Friend', 'Organised', 'Intense'],
  },
];

const WikiPreviewCard = ({ index = 0 }) => {
  const d = PREVIEW_DATA[index % PREVIEW_DATA.length];

  return (
    <div style={s.card}>
      {/* Header: name/subtitle left, photo right */}
      <div style={s.header}>
        <div style={s.headerLeft}>
          <div style={s.name}>{d.name}</div>
          <div style={s.subtitle}>{d.subtitle}</div>
        </div>
        {d.imageUrl && (
          <div style={s.infoboxPhoto}>
            <img src={d.imageUrl} alt={d.name} style={s.infoboxImg} />
          </div>
        )}
      </div>

      {/* Divider */}
      <div style={s.divider} />

      {/* Info table */}
      <div style={s.infoGrid}>
        {[['Born', d.born], ['Died', d.died], ['Occupation', d.occupation], ['Nationality', d.nationality]]
          .filter(([, v]) => v)
          .map(([label, value]) => (
            <React.Fragment key={label}>
              <span style={s.infoLabel}>{label}</span>
              <span style={s.infoValue}>{value}</span>
            </React.Fragment>
          ))}
      </div>

      {/* Divider */}
      <div style={s.divider} />

      {/* Lead text */}
      <p style={s.lead}>{d.lead}</p>

      {/* Tags */}
      <div style={s.tags}>
        {d.tags.map(t => (
          <span key={t} style={s.tag}>{t}</span>
        ))}
      </div>

      {/* Wikipedia-style footer */}
      <div style={s.footer}>
        <span style={s.footerDot}>●</span>
        <span style={s.footerText}>WikiMe · Free Encyclopedia</span>
      </div>
    </div>
  );
};

const s = {
  card: {
    width: '100%',
    height: '100%',
    background: '#fff',
    fontFamily: 'Linux Libertine, Georgia, Times, serif',
    color: '#202122',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    padding: '20px 22px 14px',
    boxSizing: 'border-box',
    gap: 0,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 10,
  },
  headerLeft: {
    flex: 1,
    minWidth: 0,
  },
  infoboxPhoto: {
    flexShrink: 0,
    background: '#f8f9fa',
    padding: 3,
  },
  infoboxImg: {
    width: 90,
    height: 110,
    objectFit: 'cover',
    objectPosition: 'top',
    display: 'block',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    lineHeight: 1.2,
    marginBottom: 3,
  },
  subtitle: {
    fontSize: 12,
    color: '#54595d',
    fontStyle: 'italic',
    lineHeight: 1.4,
  },

  divider: {
    height: 1,
    background: '#a2a9b1',
    margin: '10px 0',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: '80px 1fr',
    gap: '3px 8px',
    fontSize: 11,
    marginBottom: 4,
  },
  infoLabel: {
    fontWeight: 'bold',
    color: '#54595d',
    textAlign: 'right',
    paddingRight: 4,
  },
  infoValue: {
    color: '#202122',
  },
  lead: {
    fontSize: 11.5,
    lineHeight: 1.6,
    color: '#202122',
    margin: '6px 0',
    flex: 1,
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: 5,
    WebkitBoxOrient: 'vertical',
  },
  tags: {
    display: 'flex',
    gap: 5,
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tag: {
    fontSize: 10,
    background: '#eaf3fb',
    color: '#0645ad',
    border: '1px solid #cde4f5',
    borderRadius: 3,
    padding: '2px 7px',
  },
  footer: {
    marginTop: 10,
    paddingTop: 8,
    borderTop: '1px solid #eaecf0',
    display: 'flex',
    alignItems: 'center',
    gap: 5,
  },
  footerDot: {
    fontSize: 6,
    color: '#a2a9b1',
  },
  footerText: {
    fontSize: 10,
    color: '#a2a9b1',
    fontFamily: 'Linux Libertine, Georgia, serif',
  },
};

export default WikiPreviewCard;