from selenium import webdriver as sw
from appium import webdriver as awb
from appium.webdriver.common.appiumby import AppiumBy
from selenium.webdriver.common.by import By
from appium.options.common import AppiumOptions
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
import time

# Desired capabilities for Appium
appium_desired_capabilities = {
    "platformName": "Android",
    "deviceName": "",
    "automationName": "uiautomator2",
    "appPackage": "com.android.settings",
    "appActivity": ".Settings",
    "language": "en",
    "locale": "US",
    "headless": "true"
}

# def getEmulatorStatus():
#     try:
#         ap_driver=awb.Remote("",options=AppiumOptions().load_capabilities(appium_desired_capabilities))
#     except Exception as e:
#         ap_driver=None
#     return(ap_driver)

# Chrome options for Selenium WebDriver
options = sw.ChromeOptions()
options.add_argument("--start-maximized")
# options.add_argument("--headless=new")
# options.accept_insecure_certs = True
# emulator_hosted_url="http://localhost:4724"

# Creating a Chrome WebDriver instance
driver = sw.Chrome(options=options)


# Class for handling WebDriver operations
class WebDriver:

    def __init__(self):
        self.driver = driver
        # self.apdriver=getEmulatorStatus()

    # Method to get the current URL
    def getCurrentUrl(self):
        """
        Returns:
        - Current URL of the web page
        """
        return (self.driver.current_url)

    def refresh(self):
        """
        Returns:
        - Refreshes the Current URL of the web page
        """
        self.driver.refresh()
        return

    # Method to open a webpage
    def openPage(self, url):
        """
        Parameters:
        - url: URL of the webpage to be opened
        """
        try:
            self.driver.get(url)
        except Exception as e:
            print(e)
            return

    # Method to find an element by XPath
    def findElementByXpath(self, xpath, device_type):
        """
        Parameters:
        - xpath: XPath string to locate the element
        - device_type: String indicating whether the device is "Mobile" or "Web"
        
        Returns:
        - WebElement if found, else "Element Not Found" string
        """
        match device_type:
            case "Mobile":
                try:
                    element = self.webDriverWait(xpath, device_type)
                    if (element != None):
                        return (self.apdriver.find_element(
                            AppiumBy.XPATH, xpath))
                    else:
                        return ("Element Not Found")
                except Exception as e:
                    print(e)
                    return
            case "Web":
                try:
                    element = self.webDriverWait(xpath, device_type)
                    if (element != None):
                        return (self.driver.find_element(By.XPATH, xpath))
                    else:
                        return ("Element Not Found")
                except Exception as e:
                    print(e)
                    return
    #Method to get the Tag of the Element
    def getTagOfElement(self, xpath , device_type):
        """
        Parameters:
        - xpath: XPath string to locate the element
        - device_type: String indicating whether the device is "Mobile" or "Web"
        
        Returns:
        - WebElement if found, returns the tag of the element
        """
        try:
            element = self. findElementByXpath(xpath, device_type)
            return(element.tag_name)
        except Exception as e:
            print(e)
            return
    # Method to hover over an element
    def hoverOverElement(self, xpath, device_type):
        """
        Parameters:
        - xpath: XPath string to locate the element to hover over
        - device_type: String indicating whether the device is "Mobile" or "Web"
        """
        try:
            element = self.webDriverWait(xpath, device_type)
            if (element != None):
                hover_element = self.findElementByXpath(xpath, device_type)
                action_chains = ActionChains(self.driver)
                action_chains.move_to_element(hover_element).perform()
            else:
                return ("Element Not Found")
        except Exception as e:
            print(e)
            return

    # Method to find an element by XPath and click
    def findElementByXpathAndClick(self, xpath, device_type):
        """
        Parameters:
        - xpath: XPath string to locate the element to click
        - device_type: String indicating whether the device is "Mobile" or "Web"
        """
        match device_type:
            case "Mobile":
                try:
                    element = self.webDriverWait(xpath, device_type)
                    if (element != None):
                        self.apdriver.find_element(AppiumBy.XPATH,
                                                   xpath).click()
                    else:
                        return ("Element Not Found")
                except Exception as e:
                    print(e)
                    return
            case "Web":
                try:
                    element = self.webDriverWait(xpath, device_type)
                    if (element != None):
                        self.driver.find_element(By.XPATH, xpath).click()
                    else:
                        return ("Element Not Found")
                except Exception as e:
                    print(e)
                    return

    # Method to find an element by class name
    def findElementByClassName(self, classname, device_type):
        """
        Parameters:
        - classname: Class name of the element to locate
        - device_type: String indicating whether the device is "Mobile" or "Web"
        Returns:
        - WebElement if found, else "Element Not Found" string
        """
        match device_type:
            case "Mobile":
                try:
                    element = WebDriverWait(self.apdriver, 10).until(
                        EC.presence_of_element_located(
                            (AppiumBy.CLASS_NAME, classname)))
                    if (element != None):
                        return (self.apdriver.find_element(
                            AppiumBy.CLASS_NAME, classname))
                    else:
                        return ("Element Not Found")
                except Exception as e:
                    print(e)
                    return
            case "Web":
                try:
                    element = WebDriverWait(self.driver, 10).until(
                        EC.presence_of_element_located(
                            (By.CLASS_NAME, classname)))
                    if (element != None):
                        return (self.driver.find_element(
                            By.CLASS_NAME, classname))
                    else:
                        return ("Element Not Found")
                except Exception as e:
                    print(e)
                    return

    # Method to find an element by ID
    def findElementById(self, Id, device_type):
        """
        Parameters:
        - Id: ID of the element to locate
        - device_type: String indicating whether the device is "Mobile" or "Web"
        
        Returns:
        - WebElement if found, else "Element Not Found" string
        """
        match device_type:
            case "Mobile":
                try:
                    element = WebDriverWait(self.apdriver, 10).until(
                        EC.presence_of_element_located((AppiumBy.ID, Id)))
                    if (element != None):
                        return (self.apdriver.find_element(AppiumBy.ID, Id))
                    else:
                        return ("Element Not Found")
                except Exception as e:
                    print(e)
                    return
            case "Web":
                try:
                    element = WebDriverWait(self.driver, 10).until(
                        EC.presence_of_element_located((By.ID, Id)))
                    if (element != None):
                        return (self.driver.find_element(By.ID, Id))
                    else:
                        return ("Element Not Found")
                except Exception as e:
                    print(e)
                    return

    # Method to get child elements of an element by XPath
    def getChildElementsOfElementByXpath(self, xpath, device_type):
        """
        Parameters:
        - xpath: XPath string to locate the parent element
        - device_type: String indicating whether the device is "Mobile" or "Web"
        
        Returns:
        - List of WebElement if found, else "Element Not Found" string
        """
        match device_type:
            case "Mobile":
                try:
                    element = self.findElementByXpath(xpath, device_type)
                    if (element != None):
                        elements = element.find_elements(By.XPATH, xpath)
                        return (elements)
                    else:
                        return ("Element Not Found")
                except Exception as e:
                    print(e)
                    return
            case "Web":
                try:
                    element = self.findElementByXpath(xpath, device_type)
                    if (element != None):
                        elements = element.find_elements(By.XPATH, xpath)
                        return (elements)
                    else:
                        return ("Element Not Found")
                except Exception as e:
                    print(e)
                    return

    # Method to scroll down to an element
    def scrollDownToElement(self, xpath, device_type):
        """
        Parameters:
        - xpath: XPath string to locate the element
        - device_type: String indicating whether the device is "Mobile" or "Web"
        """
        try:
            element = WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.XPATH, xpath)))
            if (element != None):
                exec_element = self.findElementByXpath(xpath, device_type)
                self.driver.execute_script(
                    "arguments[0].scrollIntoView({ behavior: 'smooth' });",
                    exec_element)
                return
            else:
                return ("Element Not Found")
        except Exception as e:
            print(e)
            return

    # Method to scroll up to an element
    def scrollUpToElement(self, xpath, device_type):
        """
        Parameters:
        - xpath: XPath string to locate the element
        - device_type: String indicating whether the device is "Mobile" or "Web"
        """
        match device_type:
            case "Mobile":
                try:
                    element = self.webDriverWait(xpath, device_type)
                    if (element != None):
                        exec_element = self.findElementByXpath(
                            xpath, device_type)
                        self.apdriver.execute_script(
                            "arguments[0].scrollIntoView(false});",
                            exec_element)
                        return
                    else:
                        return ("Element Not Found")
                except Exception as e:
                    print(e)
                    return
            case "Web":
                try:
                    element = self.webDriverWait(xpath, device_type)
                    if (element != None):
                        exec_element = self.findElementByXpath(
                            xpath, device_type)
                        self.driver.execute_script(
                            "arguments[0].scrollIntoView(false});",
                            exec_element)
                        return
                    else:
                        return ("Element Not Found")
                except Exception as e:
                    print(e)
                    return

    # Method to capture screenshot
    def captureScreenshot(self):
        """
        Returns:
        - Screenshot of the current page as a PNG image
        """
        try:
            return (self.driver.get_screenshot_as_png())
        except Exception as e:
            print(e)
            return

    # Method to wait for an element to be visible
    def webDriverWait(self, xpath, device_type):
        """
        Parameters:
        - xpath: XPath string to locate the element
        - device_type: String indicating whether the device is "Mobile" or "Web"
        
        Returns:
        - WebElement if found, else None
        """
        match device_type:
            case "Mobile":
                try:
                    element = WebDriverWait(self.apdriver, 10).until(
                        EC.visibility_of_element_located(
                            (AppiumBy.XPATH, xpath)))
                    return (element)
                except Exception as e:
                    print(e)
                    return
            case "Web":
                try:
                    element = WebDriverWait(self.driver, 10).until(
                        EC.visibility_of_element_located((By.XPATH, xpath)))
                    return (element)
                except Exception as e:
                    print(e)
                    return

    # Method to check the visibility of an element
    def checkVisibilityOfElement(self, xpath, device_type):
        """
        Parameters:
        - xpath: XPath string to locate the element
        - device_type: String indicating whether the device is "Mobile" or "Web"
        
        Returns:
        - True if element is visible, False otherwise
        """
        try:
            data = self.webDriverWait(xpath, device_type)
            if (data != None):
                return (True)
            else:
                return (False)
        except Exception as e:
            print(e)
            return

    # Method to check the presence of an element
    def checkPresenceOfElement(self, xpath, device_type):
        """
        Parameters:
        - xpath: XPath string to locate the element
        - device_type: String indicating whether the device is "Mobile" or "Web"
        
        Returns:
        - True if element is present, False otherwise
        """
        match device_type:
            case "Mobile":
                try:
                    element = WebDriverWait(self.apdriver, 2).until(
                        EC.presence_of_element_located(
                            (AppiumBy.XPATH, xpath)))
                    if (element != None):
                        return (True)
                    else:
                        return (False)
                except Exception as e:
                    print(e)
                    return
            case "Web":
                try:
                    element = WebDriverWait(self.driver, 2).until(
                        EC.presence_of_element_located((By.XPATH, xpath)))
                    if (element != None):
                        return (True)
                    else:
                        return (False)
                except Exception as e:
                    print(e)
                    return

    # Method to switch to a different tab (Only for Web)
    def switchTab(self, tab_num):
        """
        Parameters:
        - tab_num: Index of the tab to switch to
        """
        try:
            self.driver.switch_to.window(self.driver.window_handles[tab_num])
            return
        except Exception as e:
            print(e)
            return

    # Method to get attribute of an Element
    def getElementAttribute(self, attribute, xpath):
        """
        Parameters:
        - attribute : Like Style, Height, Width Etc
        - xpath:  Unique Xpath of the element
        """
        try:
            element = self.findElementByXpath(xpath, "Web")
            attr = element.get_attribute(attribute)
            return (attr)
        except Exception as e:
            print(e)
            return

    # Method to close the current tab
    def closeTab(self, device_type):
        """
        Parameters:
        - device_type: String indicating whether the device is "Mobile" or "Web"
        """
        match device_type:
            case "Mobile":
                self.apdriver.close()
            case "Web":
                self.driver.close()

    # Method to quit the WebDriver instance
    def tearDown(self, device_type):
        """
        Parameters:
        - device_type: String indicating whether the device is "Mobile" or "Web"
        """
        match device_type:
            case "Mobile":
                self.apdriver.quit()
            case "Web":
                self.driver.quit()
    
    #Method to check title of the window
    def getTitle(self):
        """
        Parameters:
        - self: Current Instance of Webdriver class
        """
        title = self.driver.title
        return(title)
def wait_for_element_visible(self, xpath, timeout=10):
        """
        Parameters:
        - xpath: XPath string to locate the element
        - timeout: Maximum time to wait for the element to be visible (default: 10 seconds)
        
        Returns:
        - WebElement if found, else None
        """
        try:
            element = WebDriverWait(self.driver, timeout).until(
                EC.visibility_of_element_located((By.XPATH, xpath)))
            return element
        except Exception as e:
            print(e)
            return None
