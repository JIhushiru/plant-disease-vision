from pathlib import Path

import torch
import torch.nn as nn
from torchvision import models

from app.config import settings

CLASS_NAMES = [
    "Apple — Apple Scab",
    "Apple — Black Rot",
    "Apple — Cedar Apple Rust",
    "Apple — Healthy",
    "Blueberry — Healthy",
    "Cherry (including sour) — Powdery Mildew",
    "Cherry (including sour) — Healthy",
    "Corn (maize) — Cercospora Leaf Spot / Gray Leaf Spot",
    "Corn (maize) — Common Rust",
    "Corn (maize) — Northern Leaf Blight",
    "Corn (maize) — Healthy",
    "Grape — Black Rot",
    "Grape — Esca (Black Measles)",
    "Grape — Leaf Blight (Isariopsis Leaf Spot)",
    "Grape — Healthy",
    "Orange — Haunglongbing (Citrus Greening)",
    "Peach — Bacterial Spot",
    "Peach — Healthy",
    "Pepper, bell — Bacterial Spot",
    "Pepper, bell — Healthy",
    "Potato — Early Blight",
    "Potato — Late Blight",
    "Potato — Healthy",
    "Raspberry — Healthy",
    "Soybean — Healthy",
    "Squash — Powdery Mildew",
    "Strawberry — Leaf Scorch",
    "Strawberry — Healthy",
    "Tomato — Bacterial Spot",
    "Tomato — Early Blight",
    "Tomato — Late Blight",
    "Tomato — Leaf Mold",
    "Tomato — Septoria Leaf Spot",
    "Tomato — Spider Mites / Two-spotted Spider Mite",
    "Tomato — Target Spot",
    "Tomato — Tomato Yellow Leaf Curl Virus",
    "Tomato — Tomato Mosaic Virus",
    "Tomato — Healthy",
]

DISEASE_INFO = {
    "Apple — Apple Scab": {
        "cause": "Fungus Venturia inaequalis",
        "symptoms": "Dark, olive-green to brown lesions on leaves and fruit with velvety texture.",
        "treatment": "Apply fungicides (captan, myclobutanil) during spring. Remove fallen leaves to reduce overwintering spores. Plant resistant cultivars.",
    },
    "Apple — Black Rot": {
        "cause": "Fungus Botryosphaeria obtusa",
        "symptoms": "Circular brown lesions on fruit with concentric rings; leaf spots with purple margins.",
        "treatment": "Prune dead or infected branches. Remove mummified fruits. Apply fungicides during early season.",
    },
    "Apple — Cedar Apple Rust": {
        "cause": "Fungus Gymnosporangium juniperi-virginianae",
        "symptoms": "Bright orange-yellow spots on upper leaf surface with tube-like structures underneath.",
        "treatment": "Remove nearby juniper/cedar hosts. Apply fungicides at pink bud and petal fall stages.",
    },
    "Apple — Healthy": {
        "cause": "N/A",
        "symptoms": "No disease symptoms detected. Plant appears healthy.",
        "treatment": "Continue regular maintenance: proper watering, pruning, and preventive fungicide applications.",
    },
    "Blueberry — Healthy": {
        "cause": "N/A",
        "symptoms": "No disease symptoms detected. Plant appears healthy.",
        "treatment": "Maintain acidic soil pH (4.5–5.5), mulch with pine bark, and ensure adequate drainage.",
    },
    "Cherry (including sour) — Powdery Mildew": {
        "cause": "Fungus Podosphaera clandestina",
        "symptoms": "White powdery coating on leaves, shoots, and sometimes fruit.",
        "treatment": "Improve air circulation through pruning. Apply sulfur-based or systemic fungicides early in the season.",
    },
    "Cherry (including sour) — Healthy": {
        "cause": "N/A",
        "symptoms": "No disease symptoms detected. Plant appears healthy.",
        "treatment": "Continue proper irrigation, pruning, and dormant-season pest management.",
    },
    "Corn (maize) — Cercospora Leaf Spot / Gray Leaf Spot": {
        "cause": "Fungus Cercospora zeae-maydis",
        "symptoms": "Rectangular, gray to tan lesions parallel to leaf veins.",
        "treatment": "Rotate crops, till residue, and plant resistant hybrids. Apply foliar fungicides if needed.",
    },
    "Corn (maize) — Common Rust": {
        "cause": "Fungus Puccinia sorghi",
        "symptoms": "Small, circular to elongated reddish-brown pustules on both leaf surfaces.",
        "treatment": "Plant resistant hybrids. Apply fungicides if rust appears before tasseling.",
    },
    "Corn (maize) — Northern Leaf Blight": {
        "cause": "Fungus Exserohilum turcicum",
        "symptoms": "Long, cigar-shaped gray-green to tan lesions on leaves.",
        "treatment": "Use resistant hybrids and crop rotation. Apply fungicides during early infection stages.",
    },
    "Corn (maize) — Healthy": {
        "cause": "N/A",
        "symptoms": "No disease symptoms detected. Plant appears healthy.",
        "treatment": "Maintain proper fertilization, irrigation, and crop rotation schedules.",
    },
    "Grape — Black Rot": {
        "cause": "Fungus Guignardia bidwellii",
        "symptoms": "Brown circular leaf spots with dark borders; fruit shrivels into hard black mummies.",
        "treatment": "Remove mummified berries and infected canes. Apply fungicides from bud break to veraison.",
    },
    "Grape — Esca (Black Measles)": {
        "cause": "Complex of fungi including Phaeomoniella chlamydospora",
        "symptoms": "Interveinal striping on leaves; dark spots on berries; wood shows dark streaking.",
        "treatment": "No proven cure. Prune and destroy infected wood. Apply wound protectants after pruning.",
    },
    "Grape — Leaf Blight (Isariopsis Leaf Spot)": {
        "cause": "Fungus Pseudocercospora vitis",
        "symptoms": "Irregular dark brown spots on leaves, often with yellow halos.",
        "treatment": "Improve canopy air flow. Apply copper-based fungicides. Remove infected leaves.",
    },
    "Grape — Healthy": {
        "cause": "N/A",
        "symptoms": "No disease symptoms detected. Plant appears healthy.",
        "treatment": "Maintain good canopy management, proper pruning, and preventive spray programs.",
    },
    "Orange — Haunglongbing (Citrus Greening)": {
        "cause": "Bacterium Candidatus Liberibacter asiaticus, spread by Asian citrus psyllid",
        "symptoms": "Asymmetric blotchy mottling of leaves; lopsided, bitter fruit with aborted seeds.",
        "treatment": "No cure. Control psyllid vectors with insecticides. Remove infected trees to prevent spread.",
    },
    "Peach — Bacterial Spot": {
        "cause": "Bacterium Xanthomonas arboricola pv. pruni",
        "symptoms": "Small, dark, water-soaked spots on leaves that may drop out leaving a 'shot-hole' appearance.",
        "treatment": "Plant resistant varieties. Apply copper sprays at leaf fall and bactericides during growing season.",
    },
    "Peach — Healthy": {
        "cause": "N/A",
        "symptoms": "No disease symptoms detected. Plant appears healthy.",
        "treatment": "Continue proper pruning, thinning, and dormant-season copper applications.",
    },
    "Pepper, bell — Bacterial Spot": {
        "cause": "Bacterium Xanthomonas campestris pv. vesicatoria",
        "symptoms": "Small, water-soaked spots on leaves and fruit that become brown and scabby.",
        "treatment": "Use disease-free seeds and transplants. Apply copper sprays. Avoid overhead irrigation.",
    },
    "Pepper, bell — Healthy": {
        "cause": "N/A",
        "symptoms": "No disease symptoms detected. Plant appears healthy.",
        "treatment": "Maintain proper spacing, water at the base, and rotate crops yearly.",
    },
    "Potato — Early Blight": {
        "cause": "Fungus Alternaria solani",
        "symptoms": "Dark brown spots with concentric rings (target pattern) on older leaves first.",
        "treatment": "Rotate crops 2–3 years. Apply fungicides preventively. Destroy crop debris after harvest.",
    },
    "Potato — Late Blight": {
        "cause": "Oomycete Phytophthora infestans",
        "symptoms": "Large, water-soaked, dark green to brown lesions on leaves; white mold on leaf undersides.",
        "treatment": "Apply protective fungicides before symptoms appear. Destroy infected plants immediately. Plant certified seed.",
    },
    "Potato — Healthy": {
        "cause": "N/A",
        "symptoms": "No disease symptoms detected. Plant appears healthy.",
        "treatment": "Keep hilling soil around plants; maintain proper irrigation and nutrient management.",
    },
    "Raspberry — Healthy": {
        "cause": "N/A",
        "symptoms": "No disease symptoms detected. Plant appears healthy.",
        "treatment": "Prune spent canes, maintain good air circulation, and apply dormant sprays.",
    },
    "Soybean — Healthy": {
        "cause": "N/A",
        "symptoms": "No disease symptoms detected. Plant appears healthy.",
        "treatment": "Continue crop rotation, proper seed treatment, and integrated pest management.",
    },
    "Squash — Powdery Mildew": {
        "cause": "Fungi Podosphaera xanthii or Erysiphe cichoracearum",
        "symptoms": "White powdery spots on leaves expanding to cover the entire surface.",
        "treatment": "Plant resistant varieties. Apply fungicides (neem oil, potassium bicarbonate, sulfur) at first sign.",
    },
    "Strawberry — Leaf Scorch": {
        "cause": "Fungus Diplocarpon earlianum",
        "symptoms": "Irregular dark purple to brown spots on leaves; severe cases cause leaf margins to curl and dry.",
        "treatment": "Remove infected leaves. Improve air circulation. Apply fungicides during bloom period.",
    },
    "Strawberry — Healthy": {
        "cause": "N/A",
        "symptoms": "No disease symptoms detected. Plant appears healthy.",
        "treatment": "Renovate beds annually, remove runners as needed, and maintain proper mulching.",
    },
    "Tomato — Bacterial Spot": {
        "cause": "Bacterium Xanthomonas spp.",
        "symptoms": "Small, water-soaked, dark spots on leaves, stems, and fruit; leaf spots may have yellow halos.",
        "treatment": "Use disease-free seeds. Apply copper-based bactericides. Avoid working with wet plants.",
    },
    "Tomato — Early Blight": {
        "cause": "Fungus Alternaria solani",
        "symptoms": "Dark concentric-ring spots on lower leaves first; stems may show dark, sunken cankers.",
        "treatment": "Stake plants for air flow. Mulch to prevent soil splash. Apply fungicides preventively.",
    },
    "Tomato — Late Blight": {
        "cause": "Oomycete Phytophthora infestans",
        "symptoms": "Large, greasy, gray-green lesions on leaves and stems; white mold in humid conditions.",
        "treatment": "Remove infected plants immediately. Apply fungicides preventively during cool, wet weather.",
    },
    "Tomato — Leaf Mold": {
        "cause": "Fungus Passalora fulva",
        "symptoms": "Pale green to yellow spots on upper leaves; olive-green to brown velvety mold underneath.",
        "treatment": "Improve greenhouse ventilation. Reduce humidity. Apply fungicides and use resistant varieties.",
    },
    "Tomato — Septoria Leaf Spot": {
        "cause": "Fungus Septoria lycopersici",
        "symptoms": "Numerous small, circular spots with dark borders and gray centers on lower leaves.",
        "treatment": "Remove infected lower leaves. Avoid overhead watering. Apply fungicides at first sign.",
    },
    "Tomato — Spider Mites / Two-spotted Spider Mite": {
        "cause": "Arachnid Tetranychus urticae",
        "symptoms": "Tiny yellow spots (stippling) on leaves; fine webbing on leaf undersides; bronzing.",
        "treatment": "Spray with strong water jets. Release predatory mites. Apply miticides or insecticidal soap.",
    },
    "Tomato — Target Spot": {
        "cause": "Fungus Corynespora cassiicola",
        "symptoms": "Brown spots with concentric rings and yellow halos, mainly on lower and middle leaves.",
        "treatment": "Improve air circulation. Remove lower infected leaves. Apply broad-spectrum fungicides.",
    },
    "Tomato — Tomato Yellow Leaf Curl Virus": {
        "cause": "Begomovirus transmitted by whiteflies (Bemisia tabaci)",
        "symptoms": "Severe upward curling, yellowing, and stunting of leaves; reduced fruit set.",
        "treatment": "Control whitefly populations with insecticides or reflective mulch. Remove infected plants. Use resistant varieties.",
    },
    "Tomato — Tomato Mosaic Virus": {
        "cause": "Tobamovirus (ToMV), mechanically transmitted",
        "symptoms": "Mottled light and dark green mosaic pattern on leaves; leaf distortion; stunted growth.",
        "treatment": "No cure. Remove infected plants. Disinfect tools. Use resistant varieties and certified virus-free seeds.",
    },
    "Tomato — Healthy": {
        "cause": "N/A",
        "symptoms": "No disease symptoms detected. Plant appears healthy.",
        "treatment": "Continue proper staking, watering at the base, and regular inspection for early disease signs.",
    },
}


def build_model(num_classes: int, backbone: str = "efficientnet_b0") -> nn.Module:
    if backbone == "efficientnet_b0":
        model = models.efficientnet_b0(weights=None)
        model.classifier[1] = nn.Linear(model.classifier[1].in_features, num_classes)
    elif backbone == "resnet50":
        model = models.resnet50(weights=None)
        model.fc = nn.Linear(model.fc.in_features, num_classes)
    else:
        raise ValueError(f"Unsupported backbone: {backbone}")
    return model


def load_model() -> nn.Module | None:
    model_path = Path(settings.model_path)
    if not model_path.exists():
        return None

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = build_model(settings.num_classes, settings.model_backbone)

    state_dict = torch.load(model_path, map_location=device, weights_only=True)
    if "model_state_dict" in state_dict:
        state_dict = state_dict["model_state_dict"]
    model.load_state_dict(state_dict)

    model.to(device)
    model.eval()
    return model
