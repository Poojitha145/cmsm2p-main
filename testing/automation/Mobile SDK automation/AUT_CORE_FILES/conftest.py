import pytest
import time
from controltypes import ActionControl, InputControls
from webdriver import WebDriver

@pytest.fixture(scope="class")
def webdriver():
    drvr = WebDriver()
    return drvr

@pytest.fixture(scope="class")
def action_control():
    act_ctrl = ActionControl()
    return act_ctrl

@pytest.fixture(scope="class")
def input_control():
    inp_ctrl = InputControls()
    return inp_ctrl

# import pytest
# from webdriver import WebDriver
# from controltypes import ActionControl, InputControls

# @pytest.fixture
# def webdriver():
#     drvr = WebDriver()
#     return drvr

# @pytest.fixture
# def action_control():
#     act_ctrl = ActionControl()
#     return act_ctrl

# @pytest.fixture
# def input_control():
#     inp_ctrl = InputControls()
#     return inp_ctrl
