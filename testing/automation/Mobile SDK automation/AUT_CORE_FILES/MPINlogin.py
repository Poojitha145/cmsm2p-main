import pytest
import paths
import time
import values
from controltypes import ActionControl, InputControls

@pytest.mark.usefixtures("webdriver", "action_control", "input_control")
class TestMPINLoginPage:

    def test_TC000_navigate_to_mpin_page(self, webdriver):
        """Test if navigating to the M-PIN page"""
        webdriver.openPage(paths.CMS_URL)
        time.sleep(5)  # Add a wait for page to load
        page_source = webdriver.driver.page_source
        assert "Enter M-PIN" in page_source, "Expected 'Enter M-PIN' text in page source, but not found"

    def test_TC001_mpin_entry_message_displayed(self, webdriver):
        """Test if the M-PIN entry message is displayed"""
        webdriver.openPage(paths.CMS_URL)
        webdriver.openPage(paths.LOGIN_PATH_MESSAGE)
        time.sleep(5)  # Add a wait for page to load
        page_source = webdriver.driver.page_source
        assert "Enter your M-PIN for a secure entry to your card" in page_source, \
            "Expected message not found in page source"

    def test_TC002_enter_wrong_pin_displayed(self, input_control, action_control):
        """Test if entering a wrong PIN displays an error"""
        input_control.sendData(paths.LOGIN_PIN_XPATH.format(1), values.WRONG_PIN, "Web")
        action_control.click(paths.LOGIN_BUTTON_XPATH, "Web")
        time.sleep(5)  # Add a wait for error message to display
        error_message_displayed = input_control.isDisplayed(paths.ERROR_MESSAGE_XPATH, "Web")
        assert error_message_displayed, "Expected error message to be displayed after entering wrong PIN"

    def test_TC003_backspacing_mpin_blocks(self, input_control):
        """Test backspacing MPIN blocks"""
        # Enter a pin
        pin_to_enter = "1234"
        for digit in pin_to_enter:
            input_control.sendData(paths.LOGIN_PIN_XPATH.format(1), digit, "Web")
            time.sleep(5)  # Adjust sleep time as needed
    
        # Clear MPIN by sending backspace to each block
        for _ in range(len(pin_to_enter)):
            input_control.sendData(paths.LOGIN_PIN_XPATH.format(1), values.BACKSPACE_KEY, "Web")
            time.sleep(5)  # Adjust sleep time as needed

        # Check if all blocks are empty
        for i in range(1, 5):
            assert not input_control.hasText(paths.LOGIN_PIN_XPATH.format(i), "Web")

    def test_TC004_card_login_application(self, input_control, action_control, webdriver):
        """Test for card MPIN login page"""
        webdriver.openPage(paths.CMS_URL)
        for i in range(1, 5):
            input_control.sendData(paths.LOGIN_PIN_XPATH.format(i), str(i), "Web")
            action_control.click(paths.LOGIN_BUTTON_XPATH, "Web")
