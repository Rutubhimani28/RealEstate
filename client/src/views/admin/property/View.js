import { AddIcon, ChevronDownIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { AspectRatio, Box, Button, Flex, Grid, GridItem, Heading, Image, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Tab, TabList, TabPanel, TabPanels, Tabs, Text, useColorModeValue, useDisclosure } from "@chakra-ui/react";
import Card from "components/card/Card";
import { HSeparator } from "components/separator/Separator";
import Spinner from "components/spinner/Spinner";
import moment from "moment/moment";
import { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { Link, useParams } from "react-router-dom";
import { getApi } from "services/api";
import CheckTable from "../contact/components/CheckTable";
import Add from "./Add";
import Delete from "./Delete";
import Edit from "./Edit";
import PropertyPhoto from "./components/propertyPhoto";
import { HasAccess } from "../../../redux/accessUtils";

const View = () => {

    const user = JSON.parse(localStorage.getItem("user"))
    const param = useParams()
    const buttonbg = useColorModeValue("gray.200", "white");
    const [data, setData] = useState()
    const [filteredContacts, setFilteredContacts] = useState()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [edit, setEdit] = useState(false);
    const [deleteModel, setDelete] = useState(false);
    const [action, setAction] = useState(false)
    const [propertyPhoto, setPropertyPhoto] = useState(false);

    const [virtualToursorVideos, setVirtualToursorVideos] = useState(false);
    const [floorPlans, setFloorPlans] = useState(false);
    const [propertyDocuments, setPropertyDocuments] = useState(false);
    const [isLoding, setIsLoding] = useState(false)
    const [displayPropertyPhoto, setDisplayPropertyPhoto] = useState(false)
    const [type, setType] = useState(false)

    const size = "lg";

    const contactColumns = [
        { Header: 'Title', accessor: 'title' },
        { Header: "First Name", accessor: "firstName" },
        { Header: "Last Name", accessor: "lastName" },
        { Header: "Phone Number", accessor: "phoneNumber" },
        { Header: "Email Address", accessor: "email" },
        { Header: "Contact Method", accessor: "preferredContactMethod" },
    ];

    const [dynamicColumns, setDynamicColumns] = useState([...contactColumns]);
    const [selectedColumns, setSelectedColumns] = useState([...contactColumns]);

    const [addEmailHistory, setAddEmailHistory] = useState(false);
    const [addPhoneCall, setAddPhoneCall] = useState(false);

    const fetchData = async () => {
        setIsLoding(true)
        let response = await getApi('api/property/view/', param.id)
        setData(response.data.property);
        setFilteredContacts(response?.data?.filteredContacts);
        setIsLoding(false)
    }
    useEffect(() => {
        fetchData()
    }, [action])

    const [permission, contactAccess,emailAccess,callAccess] = HasAccess(['Property', 'Contacts','Email','Call']);
   
    return (
        <>
            <Add isOpen={isOpen} size={size} onClose={onClose} />
            <Edit isOpen={edit} size={size} onClose={setEdit} setAction={setAction} />
            <Delete isOpen={deleteModel} onClose={setDelete} method='one' url='api/property/delete/' id={param.id} />

            {isLoding ?
                <Flex justifyContent={'center'} alignItems={'center'} width="100%" >
                    <Spinner />
                </Flex> : <>
                    {/* <Grid templateColumns="repeat(6, 1fr)" mb={3} gap={1}>
                        <GridItem colStart={6} >
                            <Flex justifyContent={"right"}>
                                <Menu>
                                    {(permission?.create || permission?.update || permission?.delete) && <MenuButton variant="outline" colorScheme='blackAlpha' va mr={2.5} as={Button} rightIcon={<ChevronDownIcon />}>
                                        Actions
                                    </MenuButton>}
                                    <MenuDivider />
                                    <MenuList>
                                        {permission?.create && <MenuItem onClick={() => onOpen()} icon={<AddIcon />}>Add</MenuItem>}
                                        {permission?.update && <MenuItem onClick={() => setEdit(true)} icon={<EditIcon />}>Edit</MenuItem>}

                                        {permission?.delete &&
                                            <>
                                                <MenuDivider />
                                                <MenuItem onClick={() => setDelete(true)} icon={<DeleteIcon />}>Delete</MenuItem>
                                            </>
                                        }
                                    </MenuList>
                                </Menu>
                                <Link to="/properties">
                                    <Button leftIcon={<IoIosArrowBack />} variant="brand">
                                        Back
                                    </Button>
                                </Link>
                            </Flex>
                        </GridItem>
                    </Grid> */}

                    <Tabs >
                        <Grid templateColumns="repeat(3, 1fr)" mb={3} gap={1}>
                            <GridItem colSpan={2}>
                                <TabList sx={{
                                    border: "none",
                                    '& button:focus': { boxShadow: 'none', },
                                    '& button': {
                                        margin: "0 5px", border: '2px solid #8080803d', borderTopLeftRadius: "10px", borderTopRightRadius: "10px", borderBottom: 0
                                    },
                                    '& button[aria-selected="true"]': {
                                        border: "2px solid brand.200", borderBottom: 0, zIndex: '0'
                                    },
                                }} >
                                    <Tab >Information</Tab>
                                    <Tab>Gallery</Tab>
                                </TabList>

                            </GridItem>
                            <GridItem  >
                                <Flex justifyContent={"right"}>
                                    <Menu>
                                        {(user.role === 'superAdmin' || permission?.create || permission?.update || permission?.delete) && <MenuButton variant="outline" size="sm" colorScheme='blackAlpha' va mr={2.5} as={Button} rightIcon={<ChevronDownIcon />}>
                                            Actions
                                        </MenuButton>}
                                        <MenuDivider />
                                        <MenuList minWidth={2}>
                                            {user.role === 'superAdmin' || permission?.create && <MenuItem color={'blue'} onClick={() => onOpen()} icon={<AddIcon />}>Add</MenuItem>}
                                            {user.role === 'superAdmin' || permission?.update && <MenuItem onClick={() => setEdit(true)} icon={<EditIcon />}>Edit</MenuItem>}
                                            {user.role === 'superAdmin' || permission?.delete && <>
                                                <MenuDivider />
                                                <MenuItem color={'red'} onClick={() => setDelete(true)} icon={<DeleteIcon />}>Delete</MenuItem>
                                            </>}
                                        </MenuList>
                                    </Menu>
                                    <Link to="/properties">
                                        <Button size="sm" leftIcon={<IoIosArrowBack />} variant="brand">
                                            Back
                                        </Button>
                                    </Link>
                                </Flex>
                            </GridItem>
                        </Grid>

                        <TabPanels>
                            <TabPanel pt={4} p={0}>
                                <Grid templateColumns="repeat(12, 1fr)" gap={3}>
                                    <GridItem colSpan={{ base: 12, md: 6 }}>
                                        <Card >
                                            <Grid templateColumns="repeat(12, 1fr)" gap={4}>
                                                <GridItem colSpan={12}>
                                                    <Box>
                                                        <Heading size="md" mb={3}>
                                                            Basic Property Information
                                                        </Heading>
                                                        <HSeparator />
                                                    </Box>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, md: 6 }}>
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Property Type</Text>
                                                    <Text>{data?.propertyType ? data?.propertyType : 'N/A'}</Text>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, md: 6 }}>
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Year Built</Text>
                                                    <Text>{data?.yearBuilt ? data?.yearBuilt : 'N/A'}</Text>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, md: 6 }}>
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Listing Price</Text>
                                                    <Text>{data?.listingPrice ? data?.listingPrice : 'N/A'}</Text>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, md: 6 }}>
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Square Footage</Text>
                                                    <Text>{data?.squareFootage ? data?.squareFootage : 'N/A'}</Text>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, md: 6 }}>
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Number Of Bedrooms</Text>
                                                    <Text>{data?.numberofBedrooms ? data?.numberofBedrooms : 'N/A'}</Text>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, md: 6 }}>
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Number Of Bathrooms</Text>
                                                    <Text>{data?.numberofBathrooms ? data?.numberofBathrooms : 'N/A'}</Text>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, md: 6 }}>
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Previous Owners</Text>
                                                    <Text>{data?.previousOwners ? data?.previousOwners : 'N/A'}</Text>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, md: 6 }}>
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Property Address</Text>
                                                    <Text>{data?.propertyAddress ? data?.propertyAddress : 'N/A'}</Text>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12 }}>
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Property Description </Text>
                                                    <Text>{data?.propertyDescription ? data?.propertyDescription : 'N/A'}</Text>
                                                </GridItem>
                                            </Grid>
                                        </Card>
                                    </GridItem>


                                    <GridItem colSpan={{ base: 12, md: 6 }}>
                                        <Card >
                                            <Grid templateColumns="repeat(12, 1fr)" gap={4}>
                                                <GridItem colSpan={12}>
                                                    <Box>
                                                        <Heading size="md" mb={3}>
                                                            Property Features and Amenities
                                                        </Heading>
                                                        <HSeparator />
                                                    </Box>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Lot Size </Text>
                                                    <Text>{data?.lotSize ? data?.lotSize : 'N/A'}</Text>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Parking Availability </Text>
                                                    <Text textTransform={'capitalize'}>{data?.parkingAvailability ? data?.parkingAvailability : 'N/A'}</Text>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12 }} >
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Heating And Cooling Systems </Text>
                                                    <Text>{data?.heatingAndCoolingSystems ? data?.heatingAndCoolingSystems : 'N/A'}</Text>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12 }} >
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Flooring Type </Text>
                                                    <Text>{data?.flooringType ? data?.flooringType : 'N/A'}</Text>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12 }} >
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Exterior Features </Text>
                                                    <Text>{data?.exteriorFeatures ? data?.exteriorFeatures : 'N/A'}</Text>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12 }} >
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Community Amenities </Text>
                                                    <Text>{data?.communityAmenities ? data?.communityAmenities : 'N/A'}</Text>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12 }} >
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Appliances Included </Text>
                                                    <Text>{data?.appliancesIncluded ? data?.appliancesIncluded : 'N/A'}</Text>
                                                </GridItem>
                                            </Grid>
                                        </Card>
                                    </GridItem>
                                    <GridItem colSpan={{ base: 12, md: 6 }}>
                                        <Card >
                                            <Grid templateColumns="repeat(12, 1fr)" gap={4}>
                                                <GridItem colSpan={12}>
                                                    <Box>
                                                        <Heading size="md" mb={3}>
                                                            Contacts Associated with Property
                                                        </Heading>
                                                        <HSeparator />
                                                    </Box>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Sellers </Text>
                                                    <Text>{data?.sellers ? data?.sellers : 'N/A'}</Text>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Buyers </Text>
                                                    <Text>{data?.buyers ? data?.buyers : 'N/A'}</Text>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Property Managers </Text>
                                                    <Text>{data?.propertyManagers ? data?.propertyManagers : 'N/A'}</Text>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Contractors Or Service Providers </Text>
                                                    <Text>{data?.contractorsOrServiceProviders ? data?.contractorsOrServiceProviders : 'N/A'}</Text>
                                                </GridItem>
                                            </Grid>
                                        </Card>
                                    </GridItem>
                                    <GridItem colSpan={{ base: 12, md: 6 }}>
                                        <Card >
                                            <Grid templateColumns="repeat(12, 1fr)" gap={4}>
                                                <GridItem colSpan={12}>
                                                    <Box>
                                                        <Heading size="md" mb={3}>
                                                            Listing and Marketing Details
                                                        </Heading>
                                                        <HSeparator />
                                                    </Box>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Listing Status </Text>
                                                    <Text>{data?.listingStatus}</Text>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Listing Agent Or Team </Text>
                                                    <Text>{data?.listingAgentOrTeam}</Text>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Listing Date </Text>
                                                    <Text>{moment(data?.listingDate).format('L')}</Text>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Multiple Listing Service </Text>
                                                    <Text>{data?.multipleListingService}</Text>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12 }} >
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Marketing Description </Text>
                                                    <Text>{data?.marketingDescription}</Text>
                                                </GridItem>
                                            </Grid>
                                        </Card>
                                    </GridItem>
                                    <GridItem colSpan={{ base: 12, md: 6 }}>
                                        <Card >
                                            <Grid templateColumns="repeat(12, 1fr)" gap={4}>
                                                <GridItem colSpan={12}>
                                                    <Box>
                                                        <Heading size="md" mb={3}>
                                                            Financial Information
                                                        </Heading>
                                                        <HSeparator />
                                                    </Box>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Property Taxes </Text>
                                                    <Text>{data?.propertyTaxes}</Text>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12, md: 6 }} >
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Homeowners Association </Text>
                                                    <Text>{data?.homeownersAssociation}</Text>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12 }} >
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Mortgage Information </Text>
                                                    <Text>{data?.mortgageInformation}</Text>
                                                </GridItem>
                                            </Grid>
                                        </Card>
                                    </GridItem>

                                    <GridItem colSpan={{ base: 12, md: 6 }}>
                                        <Card >
                                            <Grid templateColumns="repeat(12, 1fr)" gap={4}>
                                                <GridItem colSpan={12}>
                                                    <Box>
                                                        <Heading size="md" mb={3}>
                                                            Tags or Categories
                                                        </Heading>
                                                        <HSeparator />
                                                    </Box>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12 }} >
                                                    <Text color={'blackAlpha.900'} fontSize="sm" fontWeight="bold"> Internal Notes Or Comments </Text>
                                                    <Text>{data?.internalNotesOrComments ? data?.internalNotesOrComments : 'N/A'}</Text>
                                                </GridItem>
                                            </Grid>
                                        </Card>
                                    </GridItem>

                                    {filteredContacts?.length > 0 &&
                                        <GridItem colSpan={{ base: 12 }}>
                                            <Card >
                                                <Grid templateColumns={{ base: "1fr" }} gap={4}>
                                                    <GridItem colSpan={2}>
                                                        <Box>
                                                            <Heading size="md" mb={3}>
                                                                Interested Contact
                                                            </Heading>
                                                            <HSeparator />
                                                        </Box>
                                                        <Grid templateColumns={'repeat(2, 1fr)'} gap={4}>
                                                            <GridItem colSpan={{ base: 2 }}>
                                                                <CheckTable dataColumn={contactColumns} tableData={filteredContacts} dynamicColumns={dynamicColumns} setDynamicColumns={setDynamicColumns} selectedColumns={selectedColumns} setSelectedColumns={setSelectedColumns} access={contactAccess} emailAccess={emailAccess} callAccess={callAccess} isHide={true} />
                                                            </GridItem>
                                                        </Grid>
                                                    </GridItem>

                                                </Grid>
                                            </Card>
                                        </GridItem>
                                    }
                                </Grid>
                            </TabPanel>

                            <TabPanel pt={4} p={0}>
                                <Grid templateColumns="repeat(12, 1fr)" gap={3}>
                                    <GridItem colSpan={{ base: 12, md: 6 }}>
                                        <Card >
                                            <Grid templateColumns="repeat(12, 1fr)" gap={4}>
                                                <GridItem colSpan={12}>
                                                    <Box>
                                                        <Flex flexWrap={'wrap'} mb={3} justifyContent={'space-between'} alingItem={'center'} >
                                                            <Heading size="md" >
                                                                Property Photos
                                                            </Heading>
                                                            <Button size="sm" leftIcon={<AddIcon />} onClick={() => setPropertyPhoto(true)} bg={buttonbg}>Add New</Button>
                                                            <PropertyPhoto text='Property Photos' fetchData={fetchData} isOpen={propertyPhoto} onClose={setPropertyPhoto} id={param.id} />
                                                        </Flex>
                                                        <HSeparator />
                                                    </Box>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12 }} >
                                                    <Flex overflowY={"scroll"} height={"150px"} alingItem={'center'} >
                                                        {data?.propertyPhotos?.map((item) => (
                                                            <Image width={'150px'} m={1} src={item.img} alt="Your Image" />
                                                        ))}
                                                    </Flex>
                                                    {data?.propertyPhotos.length > 0 ?
                                                        <Flex justifyContent={"end"} mt={1}>
                                                            <Button size="sm" colorScheme="brand" variant="outline" onClick={() => { setDisplayPropertyPhoto(true); setType("photo"); }}>Show more</Button>
                                                        </Flex> : ""}
                                                </GridItem>
                                            </Grid>
                                        </Card>
                                    </GridItem>
                                    <GridItem colSpan={{ base: 12, md: 6 }}>
                                        <Card >
                                            <Grid templateColumns="repeat(12, 1fr)" gap={4}>
                                                <GridItem colSpan={12}>
                                                    <Box>
                                                        <Flex flexWrap={'wrap'} mb={3} justifyContent={'space-between'} alingItem={'center'} >
                                                            <Heading size="md" >
                                                                Virtual Tours or Videos
                                                            </Heading>
                                                            <Button size="sm" leftIcon={<AddIcon />} onClick={() => setVirtualToursorVideos(true)} bg={buttonbg}>Add New</Button>
                                                            <PropertyPhoto text='Virtual Tours or Videos' fetchData={fetchData} isOpen={virtualToursorVideos} onClose={setVirtualToursorVideos} id={param.id} />
                                                        </Flex>
                                                        <HSeparator />
                                                    </Box>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12 }} >
                                                    <Flex overflowY={"scroll"} height={"150px"} alingItem={'center'} >
                                                        {data?.virtualToursOrVideos?.map((item) => (
                                                            <video width="200" controls autoplay loop style={{ margin: "0 5px" }}>
                                                                <source src={item.img} type="video/mp4" />
                                                                <source src={item.img} type="video/ogg" />
                                                            </video>
                                                        ))}
                                                    </Flex>
                                                    {data?.virtualToursOrVideos.length > 0 ?
                                                        <Flex justifyContent={"end"} mt={1}>
                                                            <Button size="sm" colorScheme="brand" variant="outline" onClick={() => { setDisplayPropertyPhoto(true); setType("video") }}>Show more</Button>
                                                        </Flex> : ""}
                                                </GridItem>
                                            </Grid>
                                        </Card>
                                    </GridItem>
                                    <GridItem colSpan={{ base: 12, md: 6 }}>
                                        <Card >
                                            <Grid templateColumns="repeat(12, 1fr)" gap={4}>
                                                <GridItem colSpan={12}>
                                                    <Box>
                                                        <Flex flexWrap={'wrap'} mb={3} justifyContent={'space-between'} alingItem={'center'} >
                                                            <Heading size="md" >
                                                                Floor Plans
                                                            </Heading>
                                                            <Button size="sm" leftIcon={<AddIcon />} onClick={() => setFloorPlans(true)} bg={buttonbg}>Add New</Button>
                                                            <PropertyPhoto text='Floor Plans' fetchData={fetchData} isOpen={floorPlans} onClose={setFloorPlans} id={param.id} />
                                                        </Flex>
                                                        <HSeparator />
                                                    </Box>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12 }} >
                                                    <Flex overflowY={"scroll"} height={"150px"} alingItem={'center'} >
                                                        {data?.floorPlans?.map((item) => (
                                                            <Image key={item.createOn} width={'30%'} m={1} src={item.img} alt="Your Image" />
                                                        ))}
                                                    </Flex>
                                                    {data?.floorPlans.length > 0 ?
                                                        <Flex justifyContent={"end"} mt={1}>
                                                            <Button size="sm" colorScheme="brand" variant="outline" onClick={() => { setDisplayPropertyPhoto(true); setType("floor"); }}>Show more</Button>
                                                        </Flex> : ""}
                                                </GridItem>
                                            </Grid>
                                        </Card>
                                    </GridItem>
                                    <GridItem colSpan={{ base: 12, md: 6 }}>
                                        <Card >
                                            <Grid templateColumns="repeat(12, 1fr)" gap={4}>
                                                <GridItem colSpan={12}>
                                                    <Box>
                                                        <Flex flexWrap={'wrap'} mb={3} justifyContent={'space-between'} alingItem={'center'} >
                                                            <Heading size="md" >
                                                                Property Documents
                                                            </Heading>
                                                            <Button size="sm" leftIcon={<AddIcon />} onClick={() => setPropertyDocuments(true)} bg={buttonbg}>Add New</Button>
                                                            <PropertyPhoto text='Property Documents' fetchData={fetchData} isOpen={propertyDocuments} onClose={setPropertyDocuments} id={param.id} />
                                                        </Flex>
                                                        <HSeparator />
                                                    </Box>
                                                </GridItem>
                                                <GridItem colSpan={{ base: 12 }} >
                                                    <Flex flexWrap={'wrap'} justifyContent={'center'} alingItem={'center'} >
                                                        {data?.propertyDocuments?.map((item) => (
                                                            <Text color='green.400' onClick={() => window.open(item?.img)} cursor={'pointer'} sx={{ '&:hover': { color: 'blue.500', textDecoration: 'underline' } }}>
                                                                {item.filename}
                                                            </Text>
                                                        ))}
                                                    </Flex>
                                                </GridItem>
                                            </Grid>
                                        </Card>
                                    </GridItem>

                                </Grid>
                            </TabPanel>
                        </TabPanels>

                    </Tabs>

                    {(permission?.delete || permission?.update || user?.role === 'superAdmin') && <Card mt={3}>
                        <Grid templateColumns="repeat(6, 1fr)" gap={1}>
                            <GridItem colStart={6} >
                                <Flex justifyContent={"right"}>
                                    {permission?.update && <Button onClick={() => setEdit(true)} size="sm" leftIcon={<EditIcon />} mr={2.5} variant="outline" colorScheme="green">Edit</Button>}
                                    {permission?.delete && <Button style={{ background: 'red.800' }} size="sm" onClick={() => setDelete(true)} leftIcon={<DeleteIcon />} colorScheme="red" >Delete</Button>}
                                </Flex>
                            </GridItem>
                        </Grid>
                    </Card>}
                </>}

            {/* property photo modal */}
            <Modal onClose={() => setDisplayPropertyPhoto(false)} isOpen={displayPropertyPhoto} >
                <ModalOverlay />
                <ModalContent maxWidth={"6xl"} height={"750px"}>
                    <ModalHeader>{type == "photo" ? "Property All Photos" : type == "video" ? "Virtual Tours or Videos" : type == "floor" ? "Floors plans" : ""}</ModalHeader>
                    <ModalCloseButton onClick={() => setDisplayPropertyPhoto(false)} />
                    <ModalBody overflowY={"auto"} height={"700px"}>
                        <div style={{ columns: 3 }}  >
                            {
                                type == "photo" ?
                                    data?.propertyPhotos?.map((item) => (
                                        <a href={item.img} target="_blank"> <Image width={"100%"} m={1} mb={4} src={item.img} alt="Your Image" /></a>
                                    )) :
                                    type == "video" ? data?.virtualToursOrVideos?.map((item) => (
                                        <a href={item.img} target="_blank">
                                            <video width="380" controls autoplay loop style={{ margin: " 5px" }}>
                                                <source src={item.img} type="video/mp4" />
                                                <source src={item.img} type="video/ogg" />
                                            </video>
                                        </a>
                                    )) : type == "floor" ?
                                        data?.floorPlans?.map((item) => (
                                            <a href={item.img} target="_blank">
                                                <Image width={"100%"} m={1} mb={4} src={item.img} alt="Your Image" />
                                            </a>
                                        )) : ""
                            }
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button size="sm" variant="outline" colorScheme='red' mr={2} onClick={() =>
                            setDisplayPropertyPhoto(false)} >Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default View;
