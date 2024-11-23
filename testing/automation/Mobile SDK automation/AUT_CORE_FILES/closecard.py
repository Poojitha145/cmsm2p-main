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
    def test_TC013_Verify_Lock_Card_Popup(self, action_control, webdriver):
        """Verify Lock Card popup appears with correct header and message"""
        action_control.click(card_summary_xpaths.LOCK_YOUR_CARD, "Web")
        time.sleep(5)

        page_source = webdriver.driver.page_source
        assert "Lock your card" in page_source, "Incorrect header text in Lock Card popup"
        assert "Locking your card will disable all future transactions and auto-payments. Do you wish to continue?" in page_source, "Incorrect message text in Lock Card popup"

    #     # You can add further assertions or interactions with the page here

    def test_TC015_Lock_Car1d(self, action_control):
        """Verify card locking functionality"""
        action_control.click(card_summary_xpaths.LOCK_YOUR_CARD_BUTTON, "Web")
        time.sleep(5)

        # Check if the button text changes to "Unlock your card"
        button_text_element = action_control.getElement(card_summary_xpaths.LOCK_YOUR_CARD, "Web")
        button_text = button_text_element.text
        assert button_text == "Unlock your card", "Lock Card button text did not change to Unlock Card"
    def test_TC01_Verify_clicking_on_Closecard(self, action_control):
        """Verify clicking close card in card control screen"""
        action_control.click(card_summary_xpaths.CLOSECARD, "Web")
        time.sleep(3)

    def test_TC018_close_card_with_header(self, action_control, webdriver):
        """Verify card close  with the header 'Close Card'"""
        page_source = webdriver.driver.page_source
        assert "Close Card" in page_source, "Expected 'Close Card ' text in page source, but not found"
    
    def test_TC019_close_card_with_sub_header(self, action_control, webdriver):
            #Initiate card and account closure
        """Verify card close  with the header 'Initiate card and account closure'"""
        page_source = webdriver.driver.page_source
        assert "Initiate card and account closure" in page_source, "Expected 'Initiate card and account closure' text in page source, but not found"

    def test_TC013_close_card_message_displayed(self, action_control, webdriver):
        """Verify the options available for closing the card"""
        page_source = webdriver.driver.page_source
        assert "Submit close card request?" in page_source, "Expected 'Submit close card request?' text in page source, but not found"

    def test_TC013_close_card_message_displayed(self, action_control, webdriver):
        """Verify the options available for closing the card"""
        page_source = webdriver.driver.page_source
        assert "Dear customer, your satisfaction is important to us. If you still choose to close your card, please select a reason and our customer support team will assist you" in page_source, "Expected 'Dear customer, your satisfaction is important to us. If you still choose to close your card, please select a reason and our customer support team will assist you' text in page source, but not found"
    
    def test_TC014_close_card_options_displayed(self, action_control, webdriver):
        """Verify the 'Tell us what is not working for you' message is displayed"""
        # Check if the message 'I want to close my card because:' is displayed
        page_source = webdriver.driver.page_source
        assert "Tell us what is not working for you" in page_source, "Expected 'Tell us what is not working for you' text in page source, but not found"

    def test_TC014_close_card_reason_options(self, action_control, webdriver):
        """to confirm whether the options available for selecting the reason to close the card"""
        # Check if the reason options are displayed in the page source
        page_source = webdriver.driver.page_source
        assert "I don't like the coin reward system" in page_source, "Option 'I don't like the coin reward system' not displayed"
        assert "I don't find this card to be secure and safe" in page_source, "Option 'I don't find this card to be secure and safe' not displayed"
        assert "I have found a better card" in page_source, "Option 'I have found a better card' not displayed"
        assert "Card charges are too high" in page_source, "Option 'Card charges are too high' not displayed"
        assert "Card does not offer on other apps" in page_source, "Option 'Card does not offer on other apps' not displayed"
        assert "Option is not listed here" in page_source, "Option 'Option is not listed here' not displayed"
    
    def test_TC016_close_card_with_reason_coin_reward_system(self, action_control, webdriver):
        """Verify selecting the reason 'I don't like the coin reward system' for closing the card"""

        # Click on the option for the reason 'I don't like the coin reward system'
        action_control.click(card_summary_xpaths.CLOSE_CARD_REASON_OPTION1, "Web")
        time.sleep(5)  # Wait for the click to take effect

        # Check if the radio button is clicked
        page_source = webdriver.driver.page_source
        radio_button_clicked = "checked" in page_source

        # Print debugging information
        #print("Page Source:", page_source)
        print("Radio button clicked:", radio_button_clicked)

        # Assert that the radio button is clicked
        assert "I don't like the coin reward system" in page_source and radio_button_clicked, "Radio button for 'I don't like the coin reward system' not clicked"
    
    def test_TC017_block_card_with_reason_damaged(self, action_control, webdriver):
     """Verify blocking the card with the reason 'Card is damaged'"""
    # Click on the option to block the card due to damage
     action_control.click(card_summary_xpaths.CLOSE_CARD_REASON_OPTION1, "Web")
     time.sleep(1)
    
    # Click on the confirmation button to block the card
     action_control.click(card_summary_xpaths.CLOSECARDSUBBMIT, "Web")
    
    # Wait for the success message to appear
     time.sleep(3)
    #  success_message_xpath = card_summary_xpaths.BLOCKSUCCESS
    #  page_source = webdriver.driver.page_source
    #  assert "" in page_source, "Expected success message not found after blocking the card"



