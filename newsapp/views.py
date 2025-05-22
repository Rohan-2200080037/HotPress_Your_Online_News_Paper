from django.shortcuts import render
from django.http import JsonResponse
import requests
from django.views.decorators.csrf import csrf_exempt

def index(request):
    return render(request, 'index.html')

@csrf_exempt
def fetch_news(request):
    query = request.GET.get('q', 'technology')
    url = f'https://newsapi.org/v2/everything?q={query}&apiKey=cede4c567c6046478cb0413b9e956f2f'
    
    response = requests.get(url)
    if response.status_code == 200:
        return JsonResponse(response.json())
    else:
        return JsonResponse({'error': 'Failed to fetch news'}, status=500)
