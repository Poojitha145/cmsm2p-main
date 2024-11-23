import pytest
import time
from conftest import action_control, input_control, webdriver
import card_summary_xpaths
import paths

@pytest.mark.usefixtures("webdriver", "action_control", "input_control")
class TestBlockCardScreen:

    def test_card_login_application(self, webdriver, input_control, action_control):
        """Test for card MPIN login page"""
        webdriver.openPage(paths.CMS_URL)
        for i in range(1, 5):
            input_control.sendData(paths.LOGIN_PIN_XPATH.format(i), str(i), "Web")
            action_control.click(paths.LOGIN_BUTTON_XPATH, "Web")
            time.sleep(1)

    def test_TC012_card_control_setting_page(self, action_control):
        """Verify clicking card setting button in card summary page"""
        action_control.click(card_summary_xpaths.CARD_SETTING, "Web")
        time.sleep(5)

    def test_TC_Verify_Lock_Card_Popup(self, action_control, webdriver):
        """Verify Lock Card popup appears with correct header and message"""
        action_control.click(card_summary_xpaths.LOCK_YOUR_CARD, "Web")
        time.sleep(5)

        page_source = webdriver.driver.page_source
        assert "Lock your card" in page_source, "Incorrect header text in Lock Card popup"
        assert "Locking your card will disable all future transactions and auto-payments. Do you wish to continue?" in page_source, "Incorrect message text in Lock Card popup"

    # def test_TC_Lock_Card(self, action_control):
    #     """Verify card locking functionality"""
    #     # Check if the button text is "Lock your card"
    #     button_text_element = action_control.getElement(card_summary_xpaths.LOCK_YOUR_CARD, "Web")
    #     button_text = button_text_element.text
    #     #assert button_text == "Lock your card", "Lock Card button text is not as expected"

    #     # Click on "Lock your card" button
    #     action_control.click(card_summary_xpaths.LOCK_YOUR_CARD, "Web")
    #     time.sleep(5)

    #     # You can add further assertions or interactions with the page here

    def test_TC_Lock_Car1d(self, action_control):
        """Verify card locking functionality"""
        action_control.click(card_summary_xpaths.LOCK_YOUR_CARD_BUTTON, "Web")
        time.sleep(5)

        # Check if the button text changes to "Unlock your card"
        button_text_element = action_control.getElement(card_summary_xpaths.LOCK_YOUR_CARD, "Web")
        button_text = button_text_element.text
        assert button_text == "Unlock your card", "Lock Card button text did not change to Unlock Card"