import pytest
import time
import paths
import values
from controltypes import ActionControl, InputControls

@pytest.mark.usefixtures("webdriver", "action_control", "input_control")
class TestMPINLoginPage:

    def test_CMS1_navigate_to_mpin_page(self, webdriver):
        """Test if navigating to the M-PIN page"""
        webdriver.openPage(paths.CMS_URL)
        time.sleep(5)  # Add a wait for page to load
        page_source = webdriver.driver.page_source
        assert "Enter M-PIN" in page_source, "Expected 'Enter M-PIN' text in page source, but not found"

    def test_CMS2_mpin_entry_message_displayed(self, webdriver):
        """Test if the M-PIN entry message is displayed"""
        webdriver.openPage(paths.CMS_URL)
        webdriver.openPage(paths.LOGIN_PATH_MESSAGE)
        time.sleep(5)  # Add a wait for page to load
        page_source = webdriver.driver.page_source
        assert "Enter your M-PIN for a secure entry to your card" in page_source, \
            "Expected message not found in page source"

    def test_CMS4_enter_wrong_pin_displayed(self, input_control, action_control):
        """Test if entering a wrong PIN displays an error"""
        input_control.sendData(paths.LOGIN_PIN_XPATH.format(1), values.WRONG_PIN, "Web")
        action_control.click(paths.LOGIN_BUTTON_XPATH, "Web")
        time.sleep(5)  # Add a wait for error message to display
        error_message_displayed = input_control.isDisplayed(paths.ERROR_MESSAGE_XPATH, "Web")
        assert error_message_displayed, "Expected error message to be displayed after entering wrong PIN"

    def test_CMS5_backspacing_mpin_blocks(self, input_control):
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

    def test_CMS6_card_login_application(self, input_control, action_control, webdriver):
        """Test for card MPIN login page"""
        webdriver.openPage(paths.CMS_URL)
        for i in range(1, 5):
            input_control.sendData(paths.LOGIN_PIN_XPATH.format(i), str(i), "Web")
            action_control.click(paths.LOGIN_BUTTON_XPATH, "Web")

    # def test_CMS12_verify_functionality_of_refreshing_mpin_page(self, action_control, webdriver):
    #     """Verify functionality of refreshing the MPIN page."""
    #     # Click on the refresh button to reload the MPIN page
    #     action_control.click(paths.REFRESH_BUTTON_XPATH, "Web")
    #     time.sleep(5)  # Add a wait for page to refresh
    #     # Assert that the page is reloaded or any specific element is present to ensure the refresh
    #     refreshed_page_source = webdriver.driver.page_source
    #     assert "Enter M-PIN" in refreshed_page_source, "MPIN page not refreshed successfully"

    def test_CMS13_only_number_keypad_displayed_on_mobile(self, webdriver):
        """Ensure only number keypad is displayed when entering PIN in MPIN blocks on mobile keypad."""
        # Implement test logic to check if the keypad displayed is a number keypad
        # You may need to inspect the elements and check their types to ensure only numbers can be entered
        # Assertion logic here

    def test_CMS14_verify_pin_masking_during_entry(self, input_control):
        """Verify PIN masking during entry."""
        # Send a sequence of numbers to the MPIN input field
        mpin = "1234"
        for digit in mpin:
            input_control.sendData(paths.MPIN_INPUT_FIELD_XPATH, digit, "Web")
            time.sleep(1)  # Adjust sleep time as needed
        # Retrieve the value from the input field and check if it's masked
        input_value = input_control.getValue(paths.MPIN_INPUT_FIELD_XPATH)
        assert input_value == "****", "PIN masking is not working properly"

    # def test_CMS15_check_presence_and_functionality_of_refresh_button(self, webdriver, action_control):
    #     """Check the presence of a refresh button in the MPIN page and its functionality."""
    #     # Check if the refresh button is visible on the MPIN page
    #     refresh_button_visible = webdriver.isElementVisible(paths.REFRESH_BUTTON_XPATH)
    #     assert refresh_button_visible, "Refresh button is not visible on the MPIN page"
    #     # Click on the refresh button
    #     action_control.click(paths.REFRESH_BUTTON_XPATH, "Web")
    #     time.sleep(5)  # Add a wait for page to refresh
    #     # Assert that the page is reloaded or any specific element is present to ensure the refresh
    #     refreshed_page_source = webdriver.driver.page_source
    #     assert "Enter M-PIN" in refreshed_page_source, "MPIN page not refreshed successfully"
