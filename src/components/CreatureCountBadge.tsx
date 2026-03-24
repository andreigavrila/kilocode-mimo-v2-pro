interface CreatureCountBadgeProps {
  count: number;
  maxCount: number;
}

export function CreatureCountBadge({ count, maxCount }: CreatureCountBadgeProps) {
  const isLow = count / maxCount < 0.25;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 20,
        height: 20,
        borderRadius: '50%',
        background: isLow ? 'var(--color-danger)' : 'var(--color-bg-secondary)',
        border: '1px solid var(--color-border-gold)',
        fontFamily: 'var(--font-creature-count)',
        fontWeight: 700,
        fontSize: 11,
        color: 'white',
      }}
    >
      {count}
    </span>
  );
}
