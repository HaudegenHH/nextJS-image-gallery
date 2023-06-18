"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Container, Navbar, Nav } from "react-bootstrap";

export default function NavBar() {
    // const router = useRouter();
    // const searchParams = useSearchParams();
    const pathName = usePathname();

    return (
        <Navbar bg="primary" variant="dark" sticky="top" expand="sm" collapseOnSelect>
            <Container>
                <Navbar.Brand as={Link} href="/">    
                    NEXT-JS 13.4 Image Gallery                    
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="main-navbar" />
                <Navbar.Collapse id="main-navbar">
                    <Nav>
                        <Nav.Link 
                            as={Link} 
                            href="/hello" 
                            active={pathName === '/hello'}
                        >
                            To Hello Page
                        </Nav.Link>
                        <Nav.Link 
                            as={Link} 
                            href="/static" 
                            active={pathName === '/static'}
                        >
                            Static
                        </Nav.Link>
                        <Nav.Link 
                            as={Link} 
                            href="/dynamic" 
                            active={pathName === '/dynamic'}
                        >
                            Dynamic
                        </Nav.Link>
                        <Nav.Link 
                            as={Link} 
                            href="/isr" 
                            active={pathName === '/isr'}
                        >
                            ISR
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}
