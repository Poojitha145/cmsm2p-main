import pytest 
import time
from controltypes import ActionControl, InputControls
import card_summary_xpaths
import card_summary_values
import Xpaths_cardcontrols
import paths
import values

@pytest.mark.usefixtures("webdriver", "action_control", "input_control")
class TestSetupNewPIN:

    def test_card_login_application(self, input_control, action_control, webdriver):
        """Test for card MPIN login page"""
        webdriver.openPage(paths.CMS_URL)
        for i in range(1, 5):
            input_control.sendData(paths.LOGIN_PIN_XPATH.format(i), str(i), "Web")
            action_control.click(paths.LOGIN_BUTTON_XPATH, "Web")
            time.sleep(0.05)

    
            
    def test_TC012_card_control_setting_page(self, action_control):
        """Verify clicking card setting button in card summary page"""
        action_control.click(card_summary_xpaths.CARD_SETTING, "Web")
        time.sleep(0.05)
    
    
            
    # def test_TC012_card_control_setting_page(self, action_control):
    #     """Verify clicking card setting button in card summary page"""
    #     action_control.click(card_summary_xpaths.CARD_SETTING, "Web")
    #     time.sleep(0.05)

    # def test_TC014_card_summary_change_your_pos_atm_pin(self, action_control):
    #     """Verify clicking change pin checks the tabs"""
    #     action_control.click(card_summary_xpaths.CHANGE_POS_ATM_PIN, "Web")
    #     time.sleep(5)

    # def test_TC016_to_change_pin_with_wrong_pin(self, input_control, action_control, webdriver):
    #     """Verify behavior when providing wrong MPIN values"""

    #     # Specify different wrong PIN values
    #     initial_new_pin = card_summary_values.WRONG_NEW_MPIN
    #     initial_reenter_pin = card_summary_values.WRONG_REENTER_NEW_MPIN

    #     # Enter wrong PIN values
    #     input_control.sendData(card_summary_xpaths.NEW_PIN_FIELD, initial_new_pin, "Web")
    #     time.sleep(2)
    #     input_control.sendData(card_summary_xpaths.REENTER_PIN_FIELD, initial_reenter_pin, "Web")
    #     time.sleep(2)
    #     action_control.click(card_summary_xpaths.UPDATE_PIN_BUTTON, "Web")
    #     time.sleep(2)

    #     # Check if the update button is disabled
    #     update_button_disabled = action_control.isElementDisabled(card_summary_xpaths.UPDATE_PIN_BUTTON, "Web")

    #     # Check if any error message is displayed
    #     error_message_displayed = action_control.isElementPresent(card_summary_xpaths.UPDATE_PIN_BUTTON, "Web")

    #     # Assert that either the update button is disabled or an error message is displayed
    #     assert update_button_disabled or error_message_displayed, "Entered PIN & Re-entered PIN doesn't match.Please try again !!"

    # def test_TC015_to_change_pin(self, input_control, action_control):
    #     """Verify setting the new pin"""
    #     input_control.sendData(card_summary_xpaths.NEW_PIN_FIELD, card_summary_values.ENTER_NEW_MPIN, "Web")
    #     time.sleep(5)
    #     input_control.sendData(card_summary_xpaths.REENTER_PIN_FIELD, card_summary_values.REENTER_NEW_MPIN, "Web")
    #     time.sleep(5)
    #     action_control.click(card_summary_xpaths.UPDATE_PIN_BUTTON, "Web")
    #     time.sleep(5)


    # def test_TC014_card_summary_change_your_pos_atm_pin(self, action_control):
    #     """Verify clicking change pin checks the tabs"""
    #     action_control.click(card_summary_xpaths.CHANGE_POS_ATM_PIN, "Web")
    #     time.sleep(5)

    # def test_TC016_to_change_pin_with_wrong_pin(self, input_control, action_control, webdriver):
    #     """Verify behavior when providing wrong MPIN values"""

    #     # Specify different wrong PIN values
    #     initial_new_pin = card_summary_values.WRONG_NEW_MPIN
    #     initial_reenter_pin = card_summary_values.WRONG_REENTER_NEW_MPIN

    #     # Enter wrong PIN values
    #     input_control.sendData(card_summary_xpaths.NEW_PIN_FIELD, initial_new_pin, "Web")
    #     time.sleep(2)
    #     input_control.sendData(card_summary_xpaths.REENTER_PIN_FIELD, initial_reenter_pin, "Web")
    #     time.sleep(2)
    #     action_control.click(card_summary_xpaths.UPDATE_PIN_BUTTON, "Web")
    #     time.sleep(2)

    #     # Check if the update button is disabled
    #     update_button_disabled = action_control.isElementDisabled(card_summary_xpaths.UPDATE_PIN_BUTTON, "Web")

    #     # Check if any error message is displayed
    #     error_message_displayed = action_control.isElementPresent(card_summary_xpaths.UPDATE_PIN_BUTTON, "Web")

    #     # Assert that either the update button is disabled or an error message is displayed
    #     assert update_button_disabled or error_message_displayed, "Entered PIN & Re-entered PIN doesn't match.Please try again !!"

    # def test_TC015_to_change_pin(self, input_control, action_control):
    #     """Verify setting the new pin"""
    #     input_control.sendData(card_summary_xpaths.NEW_PIN_FIELD, card_summary_values.ENTER_NEW_MPIN, "Web")
    #     time.sleep(5)
    #     input_control.sendData(card_summary_xpaths.REENTER_PIN_FIELD, card_summary_values.REENTER_NEW_MPIN, "Web")
    #     time.sleep(5)
    #     action_control.click(card_summary_xpaths.UPDATE_PIN_BUTTON, "Web")
    #     time.sleep(5)
