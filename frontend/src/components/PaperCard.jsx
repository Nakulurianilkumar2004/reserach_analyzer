export default function PaperCard({ paper }) {
    return (
        <div className="border p-4 rounded shadow mb-4">
            <h3 className="font-bold">{paper.filename}</h3>
            <p>Uploaded by: {paper.user_email}</p>
            <p>At: {new Date(paper.created_at).toLocaleString()}</p>
        </div>
    );
}