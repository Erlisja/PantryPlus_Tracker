'use client';
import { Box, Typography, Button, Modal, TextField, Fade, Backdrop, Grid, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { firestore } from "@/firebase";
import { collection, getDoc, query, setDoc, doc, deleteDoc, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import SvgIcon from '@mui/material/SvgIcon';
import * as React from 'react';


// Modal style
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: '#292828',
  borderRadius: 4,
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  color: 'white',
  border: '2px solid #000',
};


function HomeIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </SvgIcon>
  );
}



// Main component
export default function Home() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentItemId, setCurrentItemId] = useState(null);
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState('');
  const [category, setCategory] = React.useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [fullPantryList, setFullPantryList] = useState([]);
  const [filteredPantryList, setFilteredPantryList] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');

//Navigate to login page
const goToLogin = () => {
  router.push('/login'); // Redirect to the login page
};




  // Function to open the modal
  const handleOpenAdd = () => {
    setEditMode(false);
    setItemName('');
    setItemQuantity('');
    setCategory('');
    setExpirationDate('');
    setOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditMode(true);
    setCurrentItemId(item.id);
    setItemName(item.name);
    setItemQuantity(item.quantity.toString());
    setCategory(item.category);
    setExpirationDate(item.expirationDate);
    setOpen(true);
  };

  // Function to close the modal
  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    setItemName('');
    setItemQuantity('');
    setCategory('');
    setExpirationDate('');
  };

  // Function to fetch and update the pantry items from Firestore
  const updatePantry = async () => {
    const snapshot = query(collection(firestore, "pantry"));
    const docs = await getDocs(snapshot);
    const pantryList = [];
    docs.forEach((doc) => {
      pantryList.push({ id: doc.id, ...doc.data() });
    });
    setFullPantryList(pantryList);
    setFilteredPantryList(pantryList);
  };

  // Effect to fetch pantry items on component mount
  useEffect(() => {
    updatePantry();
  }, []);

  const addItem = async () => {
    if (!itemName || !itemQuantity || !expirationDate) {
      alert('Please fill all fields');
      return;
    }
    const docRef = doc(firestore, "pantry", itemName);
    const docSnap = await getDoc(docRef);

    if (editMode && currentItemId) {
      // Update the existing item in edit mode
      await setDoc(docRef, { name: itemName, quantity: parseInt(itemQuantity, 10), category, expirationDate }, { merge: true });
    } else if (docSnap.exists()) {
      // If item exists and we're in add mode, update quantity
      const existingData = docSnap.data();
      const newQuantity = existingData.quantity + parseInt(itemQuantity, 10);
      await setDoc(docRef, { quantity: newQuantity }, { merge: true });
    } else {
      // Add a new item
      await setDoc(docRef, { name: itemName, quantity: parseInt(itemQuantity, 10), category, expirationDate });
    }

    updatePantry();
    handleClose();
  };

  // Function to remove one unit of an item from the pantry
  const removeItem = async (id, currentQuantity) => {
    const docRef = doc(firestore, "pantry", id);

    if (currentQuantity > 1) {
      await setDoc(docRef, { quantity: currentQuantity - 1 }, { merge: true });
    } else {
      await deleteDoc(docRef);
    }

    updatePantry();
  };

  // Function to search for an item by name
  const searchItem = () => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    const filteredItems = fullPantryList.filter(item =>
      item.name.toLowerCase().includes(lowercasedSearchTerm)
    );
    setFilteredPantryList(filteredItems);
  };

  // Effect to filter pantry list based on search term and category
  useEffect(() => {
    const normalizedCategoryFilter = categoryFilter.toLowerCase();
    const filteredItems = fullPantryList
      .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter(item => {
        const itemCategory = item.category ? item.category.toLowerCase() : '';
        return !normalizedCategoryFilter || itemCategory === normalizedCategoryFilter;
      });

    console.log("Filtered items:", filteredItems); // Debugging output
    setFilteredPantryList(filteredItems);
  }, [searchTerm, categoryFilter, fullPantryList]);

  const generateRecipe = async () => {
    if (fullPantryList.length === 0) {
      alert('Your pantry is empty. Please add some items before generating a recipe.');
      return;
    }
    const ingredients = fullPantryList.map(item => item.name);
    try {
      const response = await fetch('/api/generate-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to generate recipe');
      }
  
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
  
      const recipeUrl = `/recipe?recipe=${encodeURIComponent(data.recipe)}&image=${encodeURIComponent(data.imageUrl)}`;
      router.push(recipeUrl); // Navigate to the recipe page using router.push
    } catch (error) {
      console.error('Failed to generate recipe:', error);
      alert('Failed to generate recipe. Please try again.');
    }
  };
  
  
  
  // Function to get items expiring in two weeks
  const getExpiringItems = () => {
    const today = new Date();
    const twoWeeksFromNow = new Date();
    twoWeeksFromNow.setDate(today.getDate() + 14);

    return fullPantryList.filter(item => {
      const expDate = new Date(item.expirationDate);
      return expDate <= twoWeeksFromNow && expDate >= today;
    });
  };



  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      width="100vw"
      height="100vh"
      overflow="hidden" // To ensure no scrollbars affect the layout
    >
      <Box
        position="fixed"
        top={0}
        left={0}
        width="100%"
        bgcolor="#03396c"
        color="white"
        p={4}
        display="flex"
        justifyContent="center"
        alignItems="center"
        zIndex={1} // Ensure the header is on top
      >
       <Box display="flex" alignItems="center">
      <Box sx={{ marginRight: 10 ,coursor:'pointer' }} onClick={goToLogin}>
        <HomeIcon sx={{ fontSize: 40, color: 'primary' }} />
      </Box>
        <Box display="flex" alignItems="center" gap={130}> 
          <Button variant="outlined" onClick={generateRecipe} sx={{ bgcolor: '#0a3659', color: 'white' }}>
            Generate Recipe
          </Button>
          <Button variant="outlined" onClick={handleOpenAdd} sx={{ bgcolor: '#0a3659', color: 'white' }}>
            Add Item
          </Button>
          </Box>
    </Box>
  </Box>

  <Box
    display="flex"
    flexDirection="row"
    alignItems="center"
    width="100%"
    color="white"
    gap={20}
      >
   <Box
    display="flex"
    alignItems="center"
    justifyContent="center"
    flexDirection="row"
    gap={2}
    paddingInlineStart={5}
    paddingY={15}
    paddingBottom={1}
      >
   <TextField
        id="search-item"
        label="Search Item"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          searchItem();
        }}
        InputLabelProps={{ style: { color: 'white' } }}
        sx={{ input: { color: 'white' }, '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': { borderColor: 'white' } }}
      />
      <Button
        variant="outlined"
        onClick={searchItem}
        sx={{ bgcolor: '#0a3659', color: 'white' }}
      >
        Search
      </Button>

      <Box
    display="flex"
    alignItems="center"
    justifyContent="center"
    flexDirection="row"
    gap={2}
    paddingInlineStart={110}
 
      >
     
       {/* Category Filter Dropdown */}
    <FormControl variant="outlined" sx={{  minWidth: 200, borderColor:'white', borderBlockStyle:'solid 1px' ,borderColor:'white',borderRadius:'1'}}>
      <InputLabel id="category-filter-label" style={{ color: 'white'}}>Filter by Category</InputLabel>
      <Select
        labelId="category-filter-label"
        id="category-filter"
        value={categoryFilter}
        onChange={(e) =>setCategoryFilter(e.target.value)}
        label="Filter by Category"
        IconComponent={(props) => <ArrowDropDownIcon {...props} sx={{bgcolor: 'white' }} />}
        sx={{
          color: 'white',
          bgcolor: 'black',
          '.MuiOutlinedInput-notchedOutline': {
            borderColor: 'white',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'white',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'white',
          },
        }}
        MenuProps={{
          PaperProps: {
            style: {
              color: 'white',
              backgroundColor: 'black',
            },
          },
        }}

      >
        <MenuItem value="">All Categories</MenuItem>
        <MenuItem value="Vegetables">Vegetables</MenuItem>
        <MenuItem value="Fruits">Fruits</MenuItem>
        <MenuItem value="Grains">Grains</MenuItem>
        <MenuItem value="Meat & Seafood">Meat & Seafood</MenuItem>
        <MenuItem value="Dairy & Eggs">Dairy & Eggs</MenuItem>
        <MenuItem value="Other">Other</MenuItem>
      </Select>
    </FormControl>
    </Box>
    </Box>
  </Box>
  <Box
    mt={10} // Add margin-top to accommodate fixed header height
    flex={1}
    overflow="auto" // Allow scrolling for item list
    width="100%"
    
  >
       <Box
  display="flex"
  flexDirection="row"
  justifyContent="space-between"
  gap={10}
  
>
<Box
  display="flex"
  flexDirection="column"
  paddingBottom={'10'}
  paddingInlineStart={5}
>
    <Typography variant="h3" mb={2}  >
      Pantry Items
    </Typography>
</Box>
<Box
  display="flex"
  flexDirection="column"
  paddingBottom={'10'}
  paddingInlineEnd={8}
  
>
    <Typography variant="h4" mb={2} color={'red'} >
      Expiring Items
    </Typography>
    </Box>
</Box>
    <Box
  display="flex"
  flexDirection="row"
  width="100%"
  height="calc(100vh - 64px)" // Adjust based on header height if needed
  overflow="hidden"
>
  {/* Left Side: Scrollable Grid Layout */}
  <Box
    flex={4} // Adjust flex ratio as needed
    overflow="auto"
    p={2}
  >
    <Grid container spacing={2}>
      {filteredPantryList.length > 0 ? (
        filteredPantryList.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Box
              display="flex"
              flexDirection="column"
              p={2}
              border={2}
              borderColor="grey.300"
              borderRadius={4}
              bgcolor="#03396c"
              color="white"
            >
              <Typography variant="h6">
                {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
              </Typography>
              <Typography variant="body2">Quantity: {item.quantity}</Typography>
              <Typography variant="body2">Category: {item.category}</Typography>
              <Typography variant="body2">Expires on: {item.expirationDate}</Typography>
              <Box display="flex" justifyContent="space-between" mt={1}>

              <Button
                  variant="contained"
                  onClick={() => removeItem(item.id, item.quantity)}
                  sx={{ bgcolor: '#ef5350' }}
                >
                  Delete
                </Button>
                <Button
                  variant="outlined"
                  sx={{ borderColor:'#011f4b', color: 'white', bgcolor: '#0a3659' }}
                  onClick={() => handleOpenEdit(item)}
                >
                  Edit
                </Button>
                
              </Box>

            </Box>
          </Grid>
        ))
      ) : (
        <Typography>No items found.</Typography>
      )}
    </Grid>

  </Box>

       {/* Right Side: Expiring Items Box */}
  <Box
    flex={1} // Adjust flex ratio as needed 
    p={2}
    color="red"
    overflow="auto"
  >
    <Grid container spacing={2}>
      {getExpiringItems().length > 0 ? (
        getExpiringItems().map((item) => (
          <Grid item xs={12} sm={6} md={12} key={item.id}>
            <Box
              display="flex"
              flexDirection="column"
              p={2}
              border={2}
              
              borderRadius={4}
              borderColor="white"
              bgcolor="#03396c"
              color="white"
            >
              <Typography variant="h6">
                {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
              </Typography>
              <Typography variant="body2">Quantity: {item.quantity}</Typography>
              <Typography variant="body2">Category: {item.category}</Typography>
              <Typography variant="body2" color={'red'}>Expires on: {item.expirationDate}</Typography>
            </Box>
          </Grid>
        ))
      ) : (
        <Typography>No expiring items.</Typography>
        
      )}
    </Grid>
  </Box>
</Box>
</Box>

      <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={open}
          onClose={handleClose}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 500,
            },
          }}
        >
        <Fade in={open}>
          <Box sx={modalStyle}>
            <Typography variant="h6">{editMode ? 'Edit Item': 'Add Item'}</Typography>
            <TextField
              label="Name"
              variant="outlined"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              InputLabelProps={{ style: { color: 'white' } }}
          sx={{ input: { color: 'white' }, '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': { borderColor: 'white' } }}
           
            />
            <TextField
              label="Quantity"
              type="number"
              variant="outlined"
              value={itemQuantity}
              onChange={(e) => setItemQuantity(e.target.value)}
              InputLabelProps={{ style: { color: 'white' } }}
              sx={{ input: { color: 'white' }, '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': { borderColor: 'white' } }}
            />
            <FormControl variant="outlined" sx={{ minWidth: 140, backgroundColor: '#292828', color: 'white',borderColor:'white' }}>
                <InputLabel id="category" style={{ color: 'white' }}>Category</InputLabel>
                <Select
                  labelId="item-category"
                  id="Category"
                  variant="outlined"
                  value={category}
                  label="Category"
                  onChange={(e) => setCategory(e.target.value.toLowerCase())} // Store in lowercase
                  InputLabelProps={{ style: { color: 'white' }  }}
                  sx={{
                    color: 'white',
                    
                    '.MuiOutlinedInput-notchedOutline': {
                      borderColor: 'white',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'white',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'white',
                    },
                  }}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        color: 'white',
                        backgroundColor: '#292828',
                        
                      },
                    },
                  }}
                >
                  <MenuItem value={'fruits'}>Fruits</MenuItem>
                  <MenuItem value={'vegetables'}>Vegetables</MenuItem>
                  <MenuItem value={'grains'}>Grains</MenuItem>
                  <MenuItem value={'dairy & eggs'}>Dairy & Eggs</MenuItem>
                  <MenuItem value={'meat & seafood'}>Meat & Seafood</MenuItem>
                  <MenuItem value={'other'}>Other</MenuItem>
                </Select>      
              </FormControl>

            <TextField
              label="Expiration Date"
              type="date"
              variant="outlined"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              InputLabelProps={{ style: { color: 'white' }, shrink: true }}
          sx={{ input: { color: 'white' }, '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': { borderColor: 'white' } }}
              
            />
            
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button variant="contained" color="primary" onClick={addItem}>
                {editMode ? 'Save Changes' : 'Add Item'}
              </Button>
              <Button variant="outlined" onClick={handleClose}>
                Cancel
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
}

