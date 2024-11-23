from webdriver import WebDriver
from selenium.webdriver.support.ui import Select
import win32com.client as wcom
import time


# class for performing actions on radio, check box and verification of DOM elements
class SelectionControls(WebDriver):

    def __init__(self):
        super().__init__()

    # Check if the element specified by xpath is enabled
    def isEnabled(self, xpath: str, device_type: str):
        """
        Check if the element specified by xpath is enabled.
        
        Parameters:
        - xpath (str): XPath locator of the web element.
        - device_type (str): Type of device being used for automation testing.
        
        Returns:
        - bool: True if the element is enabled, False otherwise.
        """
        try:
            return (self.findElementByXpath(xpath, device_type).is_enabled())
        except Exception as e:
            print(e)
            return (False)

    # Check if the element specified by xpath is displayed
    def isDisplayed(self, xpath: str, device_type: str):
        """
        Check if the element specified by xpath is displayed.
        
        Parameters:
        - xpath (str): XPath locator of the web element.
        - device_type (str): Type of device being used for automation testing.
        
        Returns:
        - bool: True if the element is displayed, False otherwise.
        """
        try:
            return (self.findElementByXpath(xpath, device_type).is_displayed())
        except Exception as e:
            print(e)
            return (False)

    # Check if the element specified by xpath is selected (for checkboxes and radio buttons)
    def isSelected(self, xpath: str, device_type: str):
        """
        Check if the element specified by xpath is selected (for checkboxes and radio buttons).
        
        Parameters:
        - xpath (str): XPath locator of the web element.
        - device_type (str): Type of device being used for automation testing.
        
        Returns:
        - bool: True if the element is selected, False otherwise.
        """
        try:
            return (self.findElementByXpath(xpath, device_type).is_selected())
        except Exception as e:
            print(e)
            return (False)

    # Enable the element specified by xpath (only applicable for checkboxes and radio buttons)
    def enable(self, xpath: str, device_type: str):
        """
        Enable the element specified by xpath (only applicable for checkboxes and radio buttons).
        
        Parameters:
        - xpath (str): XPath locator of the web element.
        - device_type (str): Type of device being used for automation testing.
        
        Returns:
        - bool: True if the element is enabled or selected, False otherwise.
        """
        try:
            if (self.isSelected(xpath, device_type)):
                return (True)
            else:
                self.findElementByXpathAndClick(xpath, device_type)
                return
        except Exception as e:
            print(e)
            return (False)

    # Disable the element specified by xpath (only applicable for checkboxes and radio buttons)
    def disable(self, xpath: str, device_type: str):
        """
        Disable the element specified by xpath (only applicable for checkboxes and radio buttons).
        
        Parameters:
        - xpath (str): XPath locator of the web element.
        - device_type (str): Type of device being used for automation testing.
        
        Returns:
        - bool: True if the element is disabled or deselected, False otherwise.
        """
        try:
            if (self.isSelected(xpath, device_type)):
                self.findElementByXpathAndClick(xpath, device_type)
                return
            else:
                return (False)
        except Exception as e:
            print(e)
            return (False)


# class to check radio control type functionality
class RadioValidation(SelectionControls):

    def __init__(self):
        super().__init__()


# class to check checkbox control type functionality
class CheckBoxValidation(SelectionControls):

    def __init__(self):
        super().__init__()


# class to handle the text and text area type control type functionality
class InputControls(SelectionControls):

    def __init__(self):
        super().__init__()

    # Send data to the input field specified by xpath
    def sendData(self, xpath: str, text: str, device_type: str):
        """
        Send data to the input field specified by xpath.
        
        Parameters:
        - xpath (str): XPath locator of the input field.
        - text (str): Text data to be sent to the input field.
        - device_type (str): Type of device being used for automation testing.
        
        Returns:
        - None
        """
        try:
            self.findElementByXpath(xpath, device_type).send_keys(text)
            return
        except Exception as e:
            print(e)
            return

    # Clear the data from the input field specified by xpath
    def clearData(self, xpath: str, device_type: str):
        """
        Clear the data from the input field specified by xpath.
        
        Parameters:
        - xpath (str): XPath locator of the input field.
        - device_type (str): Type of device being used for automation testing.
        
        Returns:
        - None
        """
        try:
            self.findElementByXpath(xpath, device_type).clear()
            return
        except Exception as e:
            print(e)
            return

    # Get the text from the element specified by xpath
    def getText(self, xpath: str, device_type: str):
        """
        Get the text from the element specified by xpath.
        
        Parameters:
        - xpath (str): XPath locator of the web element.
        - device_type (str): Type of device being used for automation testing.
        
        Returns:
        - str: Text content of the element.
        """
        try:
            text = self.findElementByXpath(xpath, device_type).text
            return (text)
        except Exception as e:
            print(e)
            return (None)

    # Check if the element specified by xpath has text
    def hasText(self, xpath: str, device_type: str):
        """
        Check if the element specified by xpath has text.
        
        Parameters:
        - xpath (str): XPath locator of the web element.
        - device_type (str): Type of device being used for automation testing.
        
        Returns:
        - bool: True if the element has text, False otherwise.
        """
        try:
            value = self.getText(xpath, device_type)
            if (value == "" or value == None):
                return (False)
            else:
                return (True)
        except Exception as e:
            print(e)
            return (False)
   
    def getValue(self, xpath, platform):
        """Get the value of an input field"""
        element = self.findElementByXpath(xpath, platform)
        return element.get_attribute("value") if element else None

    # Check if the text of the element specified by xpath contains only alphanumeric characters
    def isAlnum(self, xpath: str, device_type: str):
        """
        Check if the text of the element specified by xpath contains only alphanumeric characters.
        
        Parameters:
        - xpath (str): XPath locator of the web element.
        - device_type (str): Type of device being used for automation testing.
        
        Returns:
        - bool: True if the text contains only alphanumeric characters, False otherwise.
        """
        try:
            text = self.findElementByXpath(xpath, device_type).text
            return (text.isalnum())
        except Exception as e:
            print(e)
            return

    # Check if the text of the element specified by xpath contains only alphabetic characters
    def isAlpha(self, xpath: str, device_type: str):
        """
        Check if the text of the element specified by xpath contains only alphabetic characters.
        
        Parameters:
        - xpath (str): XPath locator of the web element
.
        - device_type (str): Type of device being used for automation testing.
        
        Returns:
        - bool: True if the text contains only alphabetic characters, False otherwise.
        """
        try:
            text = self.findElementByXpath(xpath, device_type).text
            return (text.isalpha())
        except Exception as e:
            print(e)
            return

    # Count the number of digits in the text of the element specified by xpath
    def countDigits(self, xpath: str, device_type: str):
        """
        Count the number of digits in the text of the element specified by xpath.
        
        Parameters:
        - xpath (str): XPath locator of the web element.
        - device_type (str): Type of device being used for automation testing.
        
        Returns:
        - int: Number of digits in the text content of the element.
        """
        try:
            count = 0
            value = int(self.findElementByXpath(xpath, device_type).text)
            while (value != 0):
                value //= 10
                count += 1
            return (count)
        except Exception as e:
            print(e)
            return


# class to handle dropdown control type
class DropDownSelection(SelectionControls):

    def __init__(self):
        super().__init__()

    # Select a value from the dropdown specified by xpath
    def selectValue(self, xpath: str, value: str, device_type: str):
        """
        Select a value from the dropdown specified by xpath.
        
        Parameters:
        - xpath (str): XPath locator of the dropdown element.
        - value (str): Value to be selected from the dropdown.
        - device_type (str): Type of device being used for automation testing.
        
        Returns:
        - None
        """
        try:
            selector = Select(self.findElementByXpath(xpath, device_type))
            selector.select_by_visible_text(value)
            return
        except Exception as e:
            print(e)
            return


# class to perform actions like click, enter
class ActionControl(SelectionControls):

    def __init__(self):
        super().__init__()

    # Click on the element specified by xpath
    def click(self, xpath: str, device_type: str):
        """
        Click on the element specified by xpath.
        
        Parameters:
        - xpath (str): XPath locator of the web element.
        - device_type (str): Type of device being used for automation testing.
        
        Returns:
        - None
        """
        try:
            self.findElementByXpath(xpath, device_type).click()
            return
        except Exception as e:
            print(e)
            return

    # Simulate pressing the Enter key
    def pressEnter(self):
        """
        Simulate pressing the Enter key.
        """
        try:
            shell = wcom.Dispatch("WScript.Shell")
            shell.SendKeys("{ENTER}")
            return
        except Exception as e:
            print(e)
            return

    def pressTab(self):
        """
        Simulate pressing the TAB key.
        """
        try:
            shell = wcom.Dispatch("WScript.Shell")
            shell.SendKeys("{TAB}")
            return
        except Exception as e:
            print(e)
            return
