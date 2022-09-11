# import pytest
import usaddress
from collections import OrderedDict


def test_api_parse_succeeds(client):
    # TODO: Finish this test. Send a request to the API and confirm that the
    # data comes back in the appropriate format.

    address_string = '123 main st chicago il'
    response = client.get("/api/parse/", {'address': address_string})

    assert response.status_code == 200

    # make sure we're returning a dictionary with 3 keys:
    #       input_string, address_components and address_type
    data = response.data
    assert type(data) == dict
    assert len(data.keys()) == 3
    assert 'input_string' in data.keys()
    assert 'address_components' in data.keys()
    assert 'address_type' in data.keys()

    # make sure the return data is of the type we expect
    assert type(data['input_string']) == str
    assert type(data['address_components']) in [dict, OrderedDict]
    assert type(data['address_type']) == str

    # check the values of the returned data
    assert data['input_string'] == address_string
    address_components, address_type = usaddress.tag(address_string)  # let's assume testing in usaddress makes sure this is correct
    assert data['address_components'] == address_components
    assert data['address_type'] == address_type


def test_api_parse_raises_error(client):
    # TODO: Finish this test. The address_string below will raise a
    # RepeatedLabelError, so ParseAddress.parse() will not be able to parse it.

    # it's not clear to me what the desired behavior is when usaddress.parse raises an
    # error I settled on catching that error and passing the information in it back
    # to the user. However, I could see security reasons where we would want to be
    # more vague about what errors occurred and what information we would want to pass
    # back, and I would consult with colleagues about this

    address_string = '123 main st chicago il 123 main st'

    # assert that AddressParse.get returns a response that includes the error
    response = client.get("/api/parse/", {'address': address_string})

    assert response.status_code == 400

    data = response.data
    assert type(data) == dict
    assert 'detail' in data.keys()


def test_api_parse_no_address_key(client):
    # Test that if we return a 400 error (rather than the default 500 error) if we
    # don't get an 'address' key

    response = client.get("/api/parse/")
    assert response.status_code == 400
    assert 'detail' in response.data.keys()

    response = client.get("/api/parse/", {'adddress': "123 E Main St"})
    assert response.status_code == 400
    assert 'detail' in response.data.keys()
