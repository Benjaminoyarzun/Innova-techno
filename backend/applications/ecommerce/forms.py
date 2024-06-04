from django import forms

class PurchaseForm(forms.Form):
    name = forms.CharField(max_length=100)
    email = forms.EmailField()
    address = forms.CharField(widget=forms.Textarea)
    city = forms.CharField(max_length=100)
    zip_code = forms.CharField(max_length=10)
    country = forms.CharField(max_length=100)