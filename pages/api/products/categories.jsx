import nc from 'next-connect'

const handler = nc();

handler.get(async (req, res) => {
    const categories = ['Computers', 'Headphones', 'Speakers', 'Phones'];
    // send categories to front-end
    res.send(categories);
});

export default handler;