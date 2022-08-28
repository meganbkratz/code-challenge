import pytest
import usaddress


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

    # check the values of the returned data
    assert data['input_string'] == address_string
    address_components, address_type = usaddress.tag(address_string)  # let's assume testing in usaddress makes sure this is correct
    assert data['address_components'] == address_components
    assert data['address_type'] == address_type


def test_api_parse_raises_error(client):
    # TODO: Finish this test. The address_string below will raise a
    # RepeatedLabelError, so ParseAddress.parse() will not be able to parse it.

    address_string = '123 main st chicago il 123 main st'

    # assert that AddressParse.parse raises a RepeatedLabelError - I don't actually know how to do this
    #with pytest.raises(usaddress.RepeatedLabelError):
    #    client.parse(address_string)

    # assert that AddressParse.get returns a response that includes the error
    response = client.get("/api/parse/", {'address': address_string})

    assert response.status_code == 400

    data = response.data
    assert type(data) == dict
    assert 'detail' in data.keys()
    