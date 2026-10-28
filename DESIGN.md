# Hieu's studio

Browser-based, interactive miniature of a personal gaming and streaming room. The user supplied an isometric timber-and-sage office image as the visual reference. Retain the user's rigged GLB character, three monitors and animated seven-color RGB lighting.

The scene uses an orthographic camera and an open architectural cutaway on an oak plinth. Materials combine timber grain generated on canvas, sage plaster, green upholstery, cream trim, terracotta pots and dark hardware. Joinery, window blinds, book spines, framed prints, keyboard keys, ceramic cups and chair stitching give close views useful detail.

RoundedBoxGeometry adds small bevels; the gaming chair has an extruded curved shell. Environment lighting, a warm directional shadow, practical lamps and orthographic SSAO provide depth. Update SSAO projection uniforms whenever the camera zoom or viewport changes. Bloom stays restrained so RGB does not obscure surfaces.

The default view is daytime. A separate night control changes the environment, sun and RGB spill. The miniature fills the main canvas; cream-and-green controls remain at the bottom. Mobile overview fits the full width of the room. The display title uses a local Georgia serif; body and controls use system sans-serif.

Night uses a true black background and hides the outer ground. Sun, hemisphere, environment, reading lamp and window emission are zero; animated RGB lights and screen spill provide the illumination. Printed artwork and wall lettering use lit materials so they do not glow in darkness. LED emission and bloom intensify at night.

The gaming pose freezes the seated animation and solves wrists within the chibi arm reach. Repositioned chair, keyboard and mouse allow the wrists to meet their targets; the palm frames point fingers forward and down, with curled mouse fingers. The livestream camera uses a front three-quarter cutaway that hides the back wall and obstructing monitors; the other presets restore them.

The left-window vitrine now holds two genuine textured Sketchfab GLB assets, distributed under CC BY 4.0 via Objaverse: Monkey D. Luffy by weijie1988 and Devil Fruit from ONEPIECE by Wendell.doc. Two larger compartments replace the previous six procedural chibi figures. Model authorship and license are verified against the source metadata inside the GLBs. Models are scaled to shelf bounds; Luffy uses a static battle sculpture with flowing robes, optimized from 837230 to 248936 triangles. Source lights are removed so room day/night controls remain authoritative. Viewer-accessible attribution is linked from the scene to model-credits.html and preserved in the GLBs and assets/onepiece/credits.json.

A small Munchkin cat roams the room using the user-provided Sketchfab GLB by Nyilonelycompany (CC BY-NC-SA 4.0). Its morph animation is retained, and a subtle procedural paw gait is added because the mesh has no leg rig; gait phase follows distance traveled. An A* floor grid expands furniture footprints by the cat radius and forbids diagonal corner cutting. Eleven connected destinations cover floor aisles and the space under the tall desk. The cat pauses between trips. A follow-camera button gives a closer view; other presets exit following. Original author/license/source remain in the GLB and assets/cat/credits.json and appear on the attribution page.
