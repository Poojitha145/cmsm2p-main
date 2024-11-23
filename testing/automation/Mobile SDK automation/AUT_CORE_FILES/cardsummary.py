import pytest
import time
from controltypes import ActionControl, InputControls
import card_summary_xpaths
import card_summary_values
import paths
import values
import Xpaths_cardcontrols

@pytest.mark.usefixtures("webdriver", "action_control", "input_control")
class TestCardSummaryPage:

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
            time.sleep(3)



    def test_TC005_to_check_name_is_there_or_not_in_card_summary_page(self, webdriver):
        """Verify if the name of the user is displayed on the card summary page"""
        name_element = webdriver.findElementByXpath(card_summary_xpaths.NAME, "Web")
        assert "Nishant Dixit" in name_element.text, "User's name not found or incorrect"
        #assert "Rohit Shirude" in name_element.text, "User's name not found or incorrect"

    def test_TC006_transaction_details_presence(self, webdriver):
        """Verify the presence of transaction details on the Card Summary page"""
        transaction_details_element = webdriver.findElementByXpath(card_summary_xpaths.TRANSACTION_DETAILS, "Web")
        transaction_details_visible = transaction_details_element.is_displayed()
        assert transaction_details_visible, "Transaction details not visible on the Card Summary page"

    def test_TC007_to_check_card_details_display(self, action_control):
        """Verify clicking the card details button to check if card details are displayed"""
        action_control.click(card_summary_xpaths.CARD_DETAILS_BUTTON, "Web")
        time.sleep(5)

    def test_TC008_to_check_cvv_masked(self, action_control):
        """Verify checking if CVV data is masked when clicking on the eye icon and card number is displayed"""
        action_control.click(card_summary_xpaths.CARD_CVV_ICON, "Web")
        time.sleep(2)

    def test_TC09_load_testing_eye_icon(self, action_control):
     """Load testing by clicking eye icon multiple times"""

     for _ in range(10):
        action_control.click(card_summary_xpaths.CARD_CVV_ICON, "Web")
        time.sleep(5)  # Add a delay to observe the effects
   


    def test_TC010_to_check_See_all(self, action_control, webdriver):
        """Verify checking on clicking on back see all button"""
        action_control.click(card_summary_xpaths.SEE_ALL, "Web")
        Comming_element = webdriver.findElementByXpath(card_summary_xpaths.COMMING_SOON, "Web")
        assert "Coming Soon" in Comming_element.text, "User's name not found or incorrect"
        action_control.click(card_summary_xpaths.BACK_BUTTON, "Web")

        time.sleep(2)
    
    def test_TC011_spent_amount_format(browser):
    # Navigate to the Card Summary page
     """Verify to check amount in decimal fromate"""
    # Find all elements containing transaction details
     transaction_details = browser.find_elements(card_summary_xpaths.TOTALAMOUNT)
    
     for transaction in transaction_details:
        # Check if the spent amount is displayed in decimal format for each transaction
        amount_element = transaction.find_element(card_summary_xpaths.TOTALAMOUNT)
        amount_text = amount_element.text
        
        assert "." in amount_text, f"Spent amount '{amount_text}' is not displayed in decimal format"
    
   

    def test_TC012_click_card_setting_button(self, action_control):
        """Verify clicking card setting button in card summary page"""
        action_control.click(card_summary_xpaths.CARD_SETTING, "Web")
        time.sleep(3)
    

    # def test_TC013_Verify_Lock_Card_Popup(self, action_control, webdriver):
    #     """Verify Lock Card popup appears with correct header and message"""
    #     action_control.click(card_summary_xpaths.LOCK_YOUR_CARD, "Web")
    #     time.sleep(5)

    #     page_source = webdriver.driver.page_source
    #     assert "Lock your card" in page_source, "Incorrect header text in Lock Card popup"
    #     assert "Locking your card will disable all future transactions and auto-payments. Do you wish to continue?" in page_source, "Incorrect message text in Lock Card popup"

    # def test_TC014_Lock_Card(self, action_control):
    #     """Verify card locking functionality"""
    #     # Check if the button text is "Lock your card"
    #     button_text_element = action_control.getElement(card_summary_xpaths.LOCK_YOUR_CARD, "Web")
    #     button_text = button_text_element.text
    #     #assert button_text == "Lock your card", "Lock Card button text is not as expected"

    #     # Click on "Lock your card" button
    #     action_control.click(card_summary_xpaths.LOCK_YOUR_CARD, "Web")
    #     time.sleep(5)

    # #     # You can add further assertions or interactions with the page here

    # def test_TC015_Lock_Car1d(self, action_control):
    #     """Verify card locking functionality"""
    #     action_control.click(card_summary_xpaths.LOCK_YOUR_CARD_BUTTON, "Web")
    #     time.sleep(5)

    #     # Check if the button text changes to "Unlock your card"
    #     button_text_element = action_control.getElement(card_summary_xpaths.LOCK_YOUR_CARD, "Web")
    #     button_text = button_text_element.text
    #     assert button_text == "Unlock your card", "Lock Card button text did not change to Unlock Card"
    
    def test_TC016_Click_Set_Limit_Button(self, action_control):
        """Verify clicking Set Limit button in card control screen"""
        action_control.click(card_summary_xpaths.SET_LIMIT, "Web")
        time.sleep(3)

    def test_TC017_Click_Domestic_Limit_Button(self, action_control):
        """Verify clicking Domestic Limit button"""
        action_control.click(card_summary_xpaths.DOMESTIC_LIMIT_BUTTON, "Web")
        time.sleep(3)
        # Add assertions to verify the displayed limits for Domestic transactions

    def test_TC018_Click_Online_Transactions_Toggle(self, action_control):
        """Verify clicking Online Transactions toggle"""
        action_control.click(card_summary_xpaths.ONLINE_TRANSACTIONS_TOGGLE, "Web")
        time.sleep(3)
        # Add assertions to verify the displayed limits for Online Transactions

    def test_TC019_Click_Offline_Transactions_Toggle(self, action_control):
        """Verify clicking Offline Transactions toggle"""
        action_control.click(card_summary_xpaths.OFFLINE_TRANSACTIONS_TOGGLE, "Web")
        time.sleep(3)
        # Add assertions to verify the displayed limits for Offline Transactions

    def test_TC020_Set_Atm_Limit(self, action_control):
        """Verify setting ATM limit"""
        # Click on the Set ATM Limit button
        action_control.click(card_summary_xpaths.SET_ATM_LIMIT_BUTTON, "Web")
        time.sleep(3)
        # Set the ATM limit using the slider or input field
        # Add assertions to verify that the ATM limit is set correctly

    def test_TC021_Toggle_Contactless_Transactions(self, action_control):
        """Verify toggling Contactless Transactions option"""
        action_control.click(card_summary_xpaths.CONTACTLESS_TRANSACTIONS_TOGGLE, "Web")
        time.sleep(3)
        # Add assertions to verify that Contactless Transactions option is selected

    def test_TC022_Click_International_Limit_Button(self, action_control):
        """Verify clicking International Limit button"""
        action_control.click(card_summary_xpaths.INTERNATIONAL_LIMIT_BUTTON, "Web")
        time.sleep(3)
        # Add assertions to verify the displayed limits for International transactions

    def test_TC022_setlimit_confrim_success_message(self, action_control, webdriver):
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
        time.sleep(8)


    def test_TC023_card_summary_change_your_pos_atm_pin(self, action_control):
        """Verify clicking change pin checks the tabs"""
        self.test_TC012_click_card_setting_button(action_control)
        action_control.click(card_summary_xpaths.CHANGE_POS_ATM_PIN, "Web")
      

    def test_TC023_to_change_pin_with_wrong_pin(self, input_control, action_control, webdriver):
        """Verify behavior when providing wrong MPIN values"""
        # Enter wrong PIN values
        input_control.sendData(card_summary_xpaths.NEW_PIN_FIELD,card_summary_values.WRONG_NEW_MPIN, "Web")
        time.sleep(2)
        input_control.sendData(card_summary_xpaths.REENTER_PIN_FIELD, card_summary_values.WRONG_REENTER_NEW_MPIN, "Web")
        time.sleep(2)
        action_control.click(card_summary_xpaths.UPDATE_PIN_BUTTON, "Web")
        time.sleep(2)
        page_source = webdriver.driver.page_source
        assert " Entered PIN & Re-entered PIN doesn't match.Please try again !!" in page_source, "Expected wrong pin message not found after set new pin the card"
        action_control.click(card_summary_xpaths.BACK_BUTTON, "Web")

    def test_TC024_to_change_pin(self, input_control, action_control, webdriver):
        """Verify setting correct new pin"""
        input_control.sendData(card_summary_xpaths.NEW_PIN_FIELD, card_summary_values.ENTER_NEW_MPIN, "Web")
        time.sleep(3)
        input_control.sendData(card_summary_xpaths.REENTER_PIN_FIELD, card_summary_values.REENTER_NEW_MPIN, "Web")
        time.sleep(3)
        action_control.click(card_summary_xpaths.UPDATE_PIN_BUTTON, "Web")
        time.sleep(3)
        page_source = webdriver.driver.page_source
        assert "PIN updated successfully!" in page_source, "Expected success message not found after set new pin the card"
        action_control.click(card_summary_xpaths.BACK_BUTTON, "Web")
        time.sleep(5)

   
    def test_TC025_Verify_clicking_on_change_billing_cycle(self, action_control):
        """Verify clicking close card in card control screen"""
        self.test_TC012_click_card_setting_button(action_control)
        action_control.click(card_summary_xpaths.CHANGEBILLINGCYCLE, "Web")
        time.sleep(3)

    def test_TC026_billing_cycle_with_header(self, action_control, webdriver):
        """Verify card close  with the header 'Change Billing Cycle'"""
        page_source = webdriver.driver.page_source
        assert "Change Billing Cycle" in page_source, "Expected 'Change Billing Cycle' text in page source, but not found"

    def test_TC027_billing_cycle_with_header(self, action_control, webdriver):
        """Verify card close  with the header 'Current billing cycle:'"""
        page_source = webdriver.driver.page_source
        assert "Current billing cycle:" in page_source, "Expected 'Current billing cycle:' text in page source, but not found"
    
    def test_TC028_billingcycle_message_displayed(self, action_control, webdriver):
        """Verify the options available for choosing billing dates"""
        page_source = webdriver.driver.page_source
        assert "Current billing cycle:" in page_source, "Expected 'Current billing cycle:' text in page source, but not found"
        action_control.click(card_summary_xpaths.BUTTON, "Web")
        time.sleep(8)


    def test_TC029_Verify_clicking_on_Blockcard(self, action_control):
        """Verify clicking block card in card control screen"""
        self.test_TC012_click_card_setting_button(action_control)
        action_control.click(card_summary_xpaths.BLOCKCARD, "Web")
        time.sleep(1)
    
    def test_TC030_block_card_with_header(self, action_control, webdriver):
        """Verify blocking the card with the header 'Block your card'"""
        page_source = webdriver.driver.page_source
        assert "Block your card" in page_source, "Expected 'Block your card' text in page source, but not found"

    def test_TC031_block_card_detail_message_displayed(self, action_control, webdriver):
        """Verify the options available for blocking the card"""
        # Check if the options "Block your card" and "Block your card permanently" are displayed
        page_source = webdriver.driver.page_source
        assert "Block your card permanently" in page_source, "Expected 'Block your card permanently' text in page source, but not found"
        
    def test_TC032_block_card_options_displayed(self, action_control, webdriver):
        """Verify the 'I want to block my card because:' message is displayed"""
        # Check if the message 'I want to block my card because:' is displayed
        page_source = webdriver.driver.page_source
        assert "I want to block my card because:" in page_source, "Expected 'I want to block my card because:' text in page source, but not found"

    def test_TC033_block_card_reason_options(self, action_control, webdriver):
        """Verify the options available for selecting the reason to block the card"""
        # Check if the reason options are displayed in the page source
        page_source = webdriver.driver.page_source
        assert "Lost my card" in page_source, "Option 'Lost my card' not displayed"
        assert "Card security is compromised" in page_source, "Option 'Card security is compromised' not displayed"
        assert "Card is damaged" in page_source, "Option 'Card is damaged' not displayed"

    def test_TC034_block_card_with_reason_lost(self, action_control, webdriver):#check the option is getting clicked
        """Verify blocking the card with the reason 'Lost my card'"""
        action_control.click(card_summary_xpaths.BLOCK_CARD_REASON_OPTION1, "Web")
        print("Clicked on 'Lost my card' radio button")  

    def test_TC035_block_card_with_reason_compromised_security(self, action_control, webdriver): #Checking the radio button clikced
        """Verify blocking the card with the reason 'Card security is compromised'"""
        action_control.click(card_summary_xpaths.BLOCK_CARD_REASON_OPTION2 + "/label", "Web")
        print("Clicked on 'Card security is compromised' radio button label")  # Debug output
        time.sleep(1)

    def test_TC036_block_card_with_reason_damaged(self, action_control, webdriver):
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
    
   
    def test_TC037_Verify_clicking_on_Closecard(self, action_control):
        """Verify clicking close card in card control screen"""
        self.test_TC012_click_card_setting_button(action_control)
        action_control.click(card_summary_xpaths.CLOSECARD, "Web")
        time.sleep(3)

    def test_TC038_close_card_with_header(self, action_control, webdriver):
        """Verify card close  with the header 'Close Card'"""
        page_source = webdriver.driver.page_source
        assert "Close Card" in page_source, "Expected 'Close Card ' text in page source, but not found"
    
    def test_TC039_close_card_with_sub_header(self, action_control, webdriver):
            #Initiate card and account closure
        """Verify card close  with the header 'Initiate card and account closure'"""
        page_source = webdriver.driver.page_source
        assert "Initiate card and account closure" in page_source, "Expected 'Initiate card and account closure' text in page source, but not found"

    def test_TC040_close_card_message_displayed(self, action_control, webdriver):
        """Verify the options available for closing the card"""
        page_source = webdriver.driver.page_source
        assert "Submit close card request?" in page_source, "Expected 'Submit close card request?' text in page source, but not found"

    def test_TC041_close_card_message_displayed(self, action_control, webdriver):
        """Verify the options available for closing the card"""
        page_source = webdriver.driver.page_source
        assert "Dear customer, your satisfaction is important to us. If you still choose to close your card, please select a reason and our customer support team will assist you" in page_source, "Expected 'Dear customer, your satisfaction is important to us. If you still choose to close your card, please select a reason and our customer support team will assist you' text in page source, but not found"
    
    def test_TC042_close_card_options_displayed(self, action_control, webdriver):
        """Verify the 'Tell us what is not working for you' message is displayed"""
        # Check if the message 'I want to close my card because:' is displayed
        page_source = webdriver.driver.page_source
        assert "Tell us what is not working for you" in page_source, "Expected 'Tell us what is not working for you' text in page source, but not found"

    def test_TC043_close_card_reason_options(self, action_control, webdriver):
        """to confirm whether the options available for selecting the reason to close the card"""
        # Check if the reason options are displayed in the page source
        page_source = webdriver.driver.page_source
        assert "I don't like the coin reward system" in page_source, "Option 'I don't like the coin reward system' not displayed"
        assert "I don't find this card to be secure and safe" in page_source, "Option 'I don't find this card to be secure and safe' not displayed"
        assert "I have found a better card" in page_source, "Option 'I have found a better card' not displayed"
        assert "Card charges are too high" in page_source, "Option 'Card charges are too high' not displayed"
        assert "Card does not offer on other apps" in page_source, "Option 'Card does not offer on other apps' not displayed"
        assert "Option is not listed here" in page_source, "Option 'Option is not listed here' not displayed"
    
    def test_TC044_close_card_with_reason_coin_reward_system(self, action_control, webdriver):
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
    
    def test_TC045_card_with_reason_damaged(self, action_control, webdriver):
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

