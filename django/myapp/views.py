from django.http import JsonResponse
from django.template.loader import render_to_string
from django.views.decorators.http import require_POST
from usend import UsendError

from .mail import send_email


@require_POST
def invite(request):
    email = request.POST["email"]
    html = render_to_string("emails/invite.html", {"inviter": request.user})
    try:
        email_id = send_email(email, "You are invited", html, idempotency_key=f"invite-{email}")
    except UsendError as e:
        return JsonResponse({"error": str(e)}, status=502)
    return JsonResponse({"id": email_id})
