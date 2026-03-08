/**
 * CategoryCard – displays a single business category pill/chip.
 * Props:
 *   icon  {string} – FontAwesome class e.g. "fa-solid fa-scissors"
 *   label {string} – Category name
 *   active {bool}  – Whether this category is selected
 *   onClick {func} – Click handler
 */
export default function CategoryCard({ icon, label, active = false, onClick }) {
    return (
        <div
            className={`cat-chip ${active ? 'active' : ''}`}
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
            aria-pressed={active}
        >
            <i className={icon}></i>
            <span>{label}</span>
        </div>
    )
}
