import pytest # type: ignore
import time
from controltypes import ActionControl, InputControls
import card_summary_xpaths
import card_summary_values
import Xpaths_cardcontrols
import paths
import values

@pytest.mark.usefixtures("webdriver", "action_control", "input_control")
class TestSetupNewPIN:

    @pytest.fixture(scope="class")
    def action_control(self):
        return ActionControl()

    @pytest.fixture(scope="class")
    def input_control(self):
        return InputControls()

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
   
    def test_TC01_Verify_clicking_on_change_billing_cycle(self, action_control):
        """Verify clicking close card in card control screen"""
        action_control.click(card_summary_xpaths.CHANGEBILLINGCYCLE, "Web")
        time.sleep(3)

    def test_TC018_billing_cycle_with_header(self, action_control, webdriver):
        """Verify card close  with the header 'Change Billing Cycle'"""
        page_source = webdriver.driver.page_source
        assert "Change Billing Cycle" in page_source, "Expected 'Change Billing Cycle' text in page source, but not found"

    def test_TC018_billing_cycle_with_header(self, action_control, webdriver):
        """Verify card close  with the header 'Current billing cycle:'"""
        page_source = webdriver.driver.page_source
        assert "Current billing cycle:" in page_source, "Expected 'Current billing cycle:' text in page source, but not found"
    
    def test_TC013_billingcycle_message_displayed(self, action_control, webdriver):
        """Verify the options available for choosing billing dates"""
        page_source = webdriver.driver.page_source
        assert "Current billing cycle:" in page_source, "Expected 'Current billing cycle:' text in page source, but not found"

    

    # def test_TC013_billing_cycle_message_displayed(self, action_control, webdriver):
    #     """Verify the options available for closing the card"""
    #     page_source = webdriver.driver.page_source
    #     assert "Billing cycle starts on 21st of every month. Pay by 8th of the same month." in page_source, "Expected 'Billing cycle starts on 21st of every month. Pay by 8th of the same month.'text in page source, but not found"
    
    # def test_TC013_billing_cycle_message_displayed(self, action_control, webdriver):
    #     """Verify the options available for closing the card"""
    #     page_source = webdriver.driver.page_source
    #     assert "Upcoming billing cycles you can choose from:" in page_source, "Expected 'Upcoming billing cycles you can choose from:' text in page source, but not found"
# import pytest
# import time
# from controltypes import ActionControl, InputControls
# import card_summary_xpaths
# import card_summary_values
# import Xpaths_cardcontrols
# import paths
# import values

# @pytest.mark.usefixtures("webdriver", "action_control", "input_control")
# class TestChangeBillingCycle:

#     def test_card_login_application(self, input_control, action_control, webdriver):
#         """Test for card MPIN login page"""
#         webdriver.openPage(paths.CMS_URL)
#         for i in range(1, 5):
#             input_control.sendData(paths.LOGIN_PIN_XPATH.format(i), str(i), "Web")
#             action_control.click(paths.LOGIN_BUTTON_XPATH, "Web")

# def test_card_control_setting_page(self, action_control):
#         """Verify clicking card setting button in card summary page"""
#         action_control.click(card_summary_xpaths.CARD_SETTING, "Web")

# def test_TC20_ChangeBillin_page(self, action_control):
#         """Verify clicking on change billing cycle"""
#         action_control.click(Xpaths_cardcontrols.CHANGE_BILLING_CYCLE, "Web")

