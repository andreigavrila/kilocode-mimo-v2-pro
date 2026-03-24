interface DamagePopupProps {
  amount: number;
  creaturesKilled: number;
}

export function DamagePopup({ amount, creaturesKilled }: DamagePopupProps) {
  return (
    <div className="damage-popup">
      <div className="damage-number">-{amount}</div>
      {creaturesKilled > 0 && (
        <div className="kill-count">💀×{creaturesKilled}</div>
      )}
    </div>
  );
}
