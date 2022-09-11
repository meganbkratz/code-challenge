import usaddress
from django.views.generic import TemplateView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
from rest_framework.exceptions import ParseError


class Home(TemplateView):
    template_name = 'parserator_web/index.html'


class AddressParse(APIView):
    renderer_classes = [JSONRenderer]

    def get(self, request):
        """
        Given a rest_framework.Request with an 'address' key, return a Response object
        with the keys:
            - 'input_string' : the string passed in as 'address'
            - 'address_components': a dictionary of parsed address components as returned
                                    by usaddress.tag
            - 'address_type': a string with the address type as returned by usaddress.tag
        If there is an error in parsing the address, raise a ParseError which includes
        an error message in its 'detail' field.
        """

        address = request.query_params['address']
        try:
            address_components, address_type = self.parse(address)
            return Response({
                'input_string': address,
                'address_components': address_components,
                'address_type': address_type,
                })
        except usaddress.RepeatedLabelError:
            raise ParseError(detail='The address "%s" could not be parsed. Please check that the address is correct and try again.\
                \n\n To report an error in parsing a valid address, please open an issue at https://github.com/datamade/usaddress/issues/new' % address)

    def parse(self, address):
        """
        Given a string, try to parse it into address components using usaddress.tag.
        Return a tuple of (address_components, address_type)
        """

        address_components, address_type = usaddress.tag(address)
        return address_components, address_type
