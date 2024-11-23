import pytest
import time
from conftest import action_control, input_control, webdriver
import card_summary_xpaths
import paths

@pytest.mark.usefixtures("webdriver", "action_control", "input_control")
class TestBlockCardScreen:

    def test_card_login_application(self, input_control, action_control, webdriver):
        """Test for card MPIN login page"""
        webdriver.openPage(paths.CMS_URL)
        for i in range(1, 5):
            input_control.sendData(paths.LOGIN_PIN_XPATH.format(i), str(i), "Web")
            action_control.click(paths.LOGIN_BUTTON_XPATH, "Web")
            time.sleep(1)
    def test_TC012_card_control_setting_page(self, action_control):
        """Verify clicking card setting button in card summary page"""
        action_control.click(card_summary_xpaths.CARD_SETTING, "Web")
        time.sleep(1)

    def test_TC_Verify_clicking_on_Blockcard(self, action_control):
        """Verify clicking block card in card control screen"""
        action_control.click(card_summary_xpaths.BLOCKCARD, "Web")
        time.sleep(1)
    
    def test_TC018_block_card_with_header(self, action_control, webdriver):
        """Verify blocking the card with the header 'Block your card'"""
        page_source = webdriver.driver.page_source
        assert "Block your card" in page_source, "Expected 'Block your card' text in page source, but not found"

    def test_TC013_block_card_detail_message_displayed(self, action_control, webdriver):
        """Verify the options available for blocking the card"""
        # Check if the options "Block your card" and "Block your card permanently" are displayed
        page_source = webdriver.driver.page_source
        assert "Block your card permanently" in page_source, "Expected 'Block your card permanently' text in page source, but not found"
        
    def test_TC013_block_card_options_displayed(self, action_control, webdriver):
        """Verify the 'I want to block my card because:' message is displayed"""
        # Check if the message 'I want to block my card because:' is displayed
        page_source = webdriver.driver.page_source
        assert "I want to block my card because:" in page_source, "Expected 'I want to block my card because:' text in page source, but not found"

    def test_TC014_block_card_reason_options(self, action_control, webdriver):
        """Verify the options available for selecting the reason to block the card"""
        # Check if the reason options are displayed in the page source
        page_source = webdriver.driver.page_source
        assert "Lost my card" in page_source, "Option 'Lost my card' not displayed"
        assert "Card security is compromised" in page_source, "Option 'Card security is compromised' not displayed"
        assert "Card is damaged" in page_source, "Option 'Card is damaged' not displayed"

    def test_TC015_block_card_with_reason_lost(self, action_control, webdriver):#check the option is getting clicked
        """Verify blocking the card with the reason 'Lost my card'"""
        action_control.click(card_summary_xpaths.BLOCK_CARD_REASON_OPTION1, "Web")
        print("Clicked on 'Lost my card' radio button")  

    def test_TC016_block_card_with_reason_compromised_security(self, action_control, webdriver): #Checking the radio button clikced
        """Verify blocking the card with the reason 'Card security is compromised'"""
        action_control.click(card_summary_xpaths.BLOCK_CARD_REASON_OPTION2 + "/label", "Web")
        print("Clicked on 'Card security is compromised' radio button label")  # Debug output
        time.sleep(1)

    def test_TC017_block_card_with_reason_damaged(self, action_control, webdriver):
        """Verify blocking the card with the reason 'Card is damaged'"""
        # Click on the option to block the card due to damage
        action_control.click(card_summary_xpaths.BLOCK_CARD_REASON_OPTION3, "Web")
        time.sleep(1)
    
        # Click on the confirmation button to block the card
        action_control.click(card_summary_xpaths.BLOCKCONFRIM, "Web")
    
        # Wait for the success message to appear
        time.sleep(1)
        page_source = webdriver.driver.page_source
        assert "Your card is blocked successfully!" in page_source, "Expected success message not found after blocking the card"
