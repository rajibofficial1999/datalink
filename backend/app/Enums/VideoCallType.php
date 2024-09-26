<?php

namespace App\Enums;

enum VideoCallType: string
{
    case DUO = "google_duo";
    case TEXT_NOW = "textnow";
    case APP_TIME = "apptime";
    case WHATS_APP = "whatsapp";
    case FACE_TIME = "facetime";
}