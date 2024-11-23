import pytest
import time
import card_summary_xpaths
import paths

@pytest.mark.usefixtures("webdriver", "action_control", "input_control")
class TestSetLimitScreen:

    def test_card_login_application(self, input_control, action_control, webdriver):
        """Test for card MPIN login page"""
        webdriver.openPage(paths.CMS_URL)
        for i in range(1, 5):
            input_control.sendData(paths.LOGIN_PIN_XPATH.format(i), str(i), "Web")
            action_control.click(paths.LOGIN_BUTTON_XPATH, "Web")
            time.sleep(3)

    def test_TC012_card_control_setting_page(self, action_control):
        """Verify clicking card setting button in card summary page"""
        action_control.click(card_summary_xpaths.CARD_SETTING, "Web")
        time.sleep(3)

    def test_TC_Click_Set_Limit_Button(self, action_control):
        """Verify clicking Set Limit button in card control screen"""
        action_control.click(card_summary_xpaths.SET_LIMIT, "Web")
        time.sleep(3)

    def test_TC_Click_Domestic_Limit_Button(self, action_control):
        """Verify clicking Domestic Limit button"""
        action_control.click(card_summary_xpaths.DOMESTIC_LIMIT_BUTTON, "Web")
        time.sleep(3)
        # Add assertions to verify the displayed limits for Domestic transactions

    def test_TC_Click_Online_Transactions_Toggle(self, action_control):
        """Verify clicking Online Transactions toggle"""
        action_control.click(card_summary_xpaths.ONLINE_TRANSACTIONS_TOGGLE, "Web")
        time.sleep(3)
        # Add assertions to verify the displayed limits for Online Transactions

    def test_TC_Click_Offline_Transactions_Toggle(self, action_control):
        """Verify clicking Offline Transactions toggle"""
        action_control.click(card_summary_xpaths.OFFLINE_TRANSACTIONS_TOGGLE, "Web")
        time.sleep(3)
        # Add assertions to verify the displayed limits for Offline Transactions

    def test_TC_Set_Atm_Limit(self, action_control):
        """Verify setting ATM limit"""
        # Click on the Set ATM Limit button
        action_control.click(card_summary_xpaths.SET_ATM_LIMIT_BUTTON, "Web")
        time.sleep(3)
        # Set the ATM limit using the slider or input field
        # Add assertions to verify that the ATM limit is set correctly

    def test_TC_Toggle_Contactless_Transactions(self, action_control):
        """Verify toggling Contactless Transactions option"""
        action_control.click(card_summary_xpaths.CONTACTLESS_TRANSACTIONS_TOGGLE, "Web")
        time.sleep(3)
        # Add assertions to verify that Contactless Transactions option is selected

    def test_TC_Click_International_Limit_Button(self, action_control):
        """Verify clicking International Limit button"""
        action_control.click(card_summary_xpaths.INTERNATIONAL_LIMIT_BUTTON, "Web")
        time.sleep(3)
        # Add assertions to verify the displayed limits for International transactions

    def test_TC017_setlimit_confrim_success_message(self, action_control, webdriver):
        """Verify clikcing on card button and getting success message """
        # Click on the option to block the card due to damage
        action_control.click(card_summary_xpaths.CONTACTLESS_TRANSACTIONS_TOGGLE, "Web")
        time.sleep(1)

        # Click on the confirmation button to block the card
        action_control.click(card_summary_xpaths.CONFRIMBUTTON, "Web")

        # Wait for the success message to appear
        time.sleep(3)
        page_source = webdriver.driver.page_source
        assert "Successfully Set." in page_source, "Expected success message not found after blocking the card"
