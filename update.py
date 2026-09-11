import os
import json

def update_comics_json(images_folder="images", output_file="comics.json"):
    """
    Scans the images folder, detects comics and their image files,
    and updates the comics.json file.
    """
    comics = {}

    # Iterate through each folder in the images directory
    for comic_folder in os.listdir(images_folder):
        folder_path = os.path.join(images_folder, comic_folder)

        # Check if it's a directory
        if os.path.isdir(folder_path):
            # Get a list of image files (jpg, jpeg, png, gif)
            images = sorted(
                [f for f in os.listdir(folder_path) if f.lower().endswith(('.jpg', '.jpeg', '.png', '.gif'))], key=lambda x: int(os.path.splitext(x)[0])
            )
            
            if images:
                comics[comic_folder] = images

    # Write the detected comics and images to the JSON file
    with open(output_file, "w") as json_file:
        json.dump(comics, json_file, indent=4)

    print(f"Comics JSON updated! {len(comics)} comics found.")

# Run the script
if __name__ == "__main__":
    update_comics_json()
