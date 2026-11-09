/**
 * The footer wordmark as plain lettering in the current text colour. It sits
 * on the footer's fluted glass, so the letters themselves stay solid. The
 * SVG text is stretched to the full width with textLength, so it scales with
 * the element.
 */
export default function GradientWordmark({ text = 'gradflow' }: { text?: string }) {
  return (
    <svg viewBox='0 0 1000 250' className='block w-full' role='img' aria-label={text}>
      <text
        x='4'
        y='190'
        textLength='992'
        lengthAdjust='spacingAndGlyphs'
        fontSize='240'
        fontWeight='600'
        fill='currentColor'
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {text}
      </text>
    </svg>
  )
}
