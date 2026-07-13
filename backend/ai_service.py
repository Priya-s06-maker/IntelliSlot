from groq import Groq
from dotenv import load_dotenv
import os
import json
load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

# def check_schedule_conflict(existing_bookings, new_booking):

#     prompt = f"""
# You are an intelligent meeting scheduling assistant.

# Existing appointments:

# {existing_bookings}

# New appointment request:

# {new_booking}

# Analyze whether the new appointment overlaps with any existing appointment.

# Return ONLY valid JSON.

# If there is NO conflict, return:

# {{
#     "conflict": false,
#     "reason": "",
#     "suggested_slot": ""
# }}

# If there IS a conflict, return:

# {{
#     "conflict": true,
#     "reason": "Explain why there is a conflict.",
#     "suggested_slot": "Suggest another available time slot."
# }}

# Do not return any explanation outside the JSON.
# """

#     response = client.chat.completions.create(

#         model="llama-3.3-70b-versatile",

#         messages=[

#             {
#                 "role": "user",
#                 "content": prompt
#             }

#         ]

#     )

#     result = response.choices[0].message.content

# return json.loads(result)
# def test_ai():

#     response = client.chat.completions.create(

#         model="llama-3.3-70b-versatile",

#         messages=[

#             {
#                 "role": "user",
#                 "content": "Say hello to IntelliSlot in one sentence."
#             }

#         ]

#     )

#     return response.choices[0].message.content

def check_schedule_conflict(existing_bookings, new_booking):
    prompt = f"""
You are an intelligent meeting scheduling assistant.

Existing appointments:

{existing_bookings}

New appointment request:

{new_booking}

Analyze whether the new appointment overlaps with any existing appointment.

Return ONLY valid JSON.

If there is NO conflict, return:

{{
    "conflict": false,
    "reason": "",
    "suggested_slot": ""
}}

If there IS a conflict, return:

{{
    "conflict": true,
    "reason": "Explain why there is a conflict.",
    "suggested_slot": "Suggest another available time slot."
}}

Do not return any explanation outside the JSON.
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    result = response.choices[0].message.content
    print("========== AI RESPONSE ==========")
    print(result)
    print("=================================")
    result = result.replace("```json", "").replace("```", "").strip()
    return json.loads(result)