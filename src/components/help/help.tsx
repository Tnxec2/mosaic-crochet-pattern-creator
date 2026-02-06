


export const Help = () => {
    return (
        <div className="modal" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Modal title</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    
                    <h1 id="user-interface">User Interface</h1>
<p>Left Sidebar:</p>
<ul>
<li>Minimap – Displays the entire pattern and allows for quick navigation.</li>
<li>Pattern Size – Set the number of rows and columns for your design.</li>
<li>Color Palette – Choose colors for your stitches.</li>
<li>Stitch Types – Select different symbols for different stitch types.</li>
<li>Properties – Adjust the settings of pattern creation.</li>
<li>Copy Buffer – Displays the last copied pattern section.</li>
</ul>
<p>Main Menu:</p>
<ul>
<li>File</li>
<li>New Pattern – Create a new design.</li>
<li>Load Pattern – Open an existing pattern file.</li>
<li>Save Pattern – Save your current design to a file.</li>
<li>Export Pattern – Export your design as an image or PDF.</li>
<li>Import Image into Pattern – Convert an image into a mosaic crochet pattern.</li>
<li>Examples</li>
</ul>
<p>Pre-made patterns to help you get started or inspire your creativity.</p>
<h2 id="loading-and-saving-patterns">Loading and Saving Patterns</h2>
<p>You can save your pattern locally on your PC as a JSON file.</p>
<p>You can load this file later.</p>
<h2 id="exporting-patterns">Exporting Patterns</h2>
<p>You can export your pattern as:</p>
<ul>
<li>PNG image</li>
<li>Image as a PDF page (for programs that can only open PDF files)</li>
<li>Textual pattern as a PDF</li>
<li>Textual pattern as HTML (You can edit this HTML in other programs)</li>
</ul>
<p>Here you can specify the file name, font size, and scaling factor.</p>
<h2 id="importing-an-image-into-a-pattern">Importing an Image into a Pattern</h2>
<p>You can upload an image to create a basic mosaic pattern. You can then adjust the colors and refine the design manually.</p>
<p>Tips:</p>
<ul>
<li>Use simple, high-contrast images for optimal results.</li>
<li>More complex images usually require manual post-processing after conversion.</li>
</ul>
<p>First, select the image you want to load.</p>
<p>You can then change various options:</p>
<ul>
<li>Crop borders</li>
<li>Colors</li>
<li>Size</li>
</ul>
<h2 id="draw-patterns">Draw patterns</h2>
<p>There are two modes:</p>
<ul>
<li>Full-screen view</li>
<li>You see the entire pattern at once.</li>
<li>Pattern section (viewport)</li>
<li>You see only a portion of the pattern. You can split the view into two areas.</li>
</ul>
<h2 id="pop-up-menu">Pop-up menu</h2>
<ol>
<li>Click on the row or column index to open the row/column pop-up menu.</li>
<li>Hold down the Ctrl key and click on the pattern to open the cell pop-up menu.</li>
</ol>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" className="btn btn-primary">Save changes</button>
                </div>
                </div>
            </div>
        </div>
    )
}