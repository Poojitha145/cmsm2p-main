import '../../assets/styles/styles.css';

export function SettingsHeader(props) {
    const { onClose } = props;

    return (
        <div class="header-wrapper back-header">
            <div class="header-container">
                <div class="header-menu-wrapper">
                    <button class="btn" onClick={onClose}>
                        <i class="feather-arrow-left"></i>
                    </button>
                </div>
                <div class="header-title">Card Controls</div>
                <div class="header-right-wrapper"></div>
            </div>
        </div>
    )
}