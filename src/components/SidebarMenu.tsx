import { useState } from "react";
import {
    Box,
    List,
    ListItemButton,
    ListItemText,
    Collapse,
    Tooltip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate, useLocation } from "react-router-dom";

import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArticleIcon from "@mui/icons-material/Article";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { menuItems } from "../data/menuItems";

interface SidebarMenuProps {
    openSidebar: boolean;
}

const SidebarMenu = ({ openSidebar }: SidebarMenuProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();

    const [openModules, setOpenModules] = useState<Record<string, boolean>>({});
    const [openSubmodules, setOpenSubmodules] = useState<Record<string, boolean>>({});

    const style = {
        container: {
            width: openSidebar ? "280px" : "76px",
            minHeight: "100vh",
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            borderRight: `1px solid ${theme.palette.divider}`,
            padding: "18px 10px",
            transition: "width 0.3s ease",
            overflow: "hidden",
            boxShadow: "3px 0 14px rgba(0,0,0,0.06)",
        },

        list: {
            padding: 0,
        },

        moduleWrapper: {
            marginBottom: "8px",
        },

        moduleButton: (isModuleOpen: boolean) => ({
            minHeight: 46,
            borderRadius: "14px",
            padding: openSidebar ? "10px 12px" : "10px",
            justifyContent: openSidebar ? "flex-start" : "center",
            color: isModuleOpen
                ? theme.palette.primary.main
                : theme.palette.text.secondary,
            backgroundColor: isModuleOpen
                ? `${theme.palette.primary.main}14`
                : "transparent",
            transition: "all 0.25s ease",
            "&:hover": {
                backgroundColor: `${theme.palette.primary.main}12`,
                color: theme.palette.primary.main,
            },
        }),

        moduleIconBox: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: openSidebar ? "34px" : "auto",
        },

        moduleText: {
            marginLeft: "10px",
            "& .MuiListItemText-primary": {
                fontSize: "0.95rem",
                fontWeight: 800,
                whiteSpace: "nowrap",
            },
        },

        submodulesContainer: {
            marginTop: "6px",
            marginLeft: "8px",
            paddingLeft: "8px",

            borderLeft: `2px solid ${theme.palette.divider}`,
        },

        submoduleWrapper: {
            marginBottom: "6px",
        },

        submoduleButton: (isSubmoduleOpen: boolean) => ({
            minHeight: 42,
            borderRadius: "12px",
            padding: "8px 10px",
            color: isSubmoduleOpen
                ? theme.palette.primary.main
                : theme.palette.text.secondary,
            backgroundColor: isSubmoduleOpen
                ? `${theme.palette.primary.main}10`
                : "transparent",
            transition: "all 0.25s ease",
            "&:hover": {
                backgroundColor: `${theme.palette.primary.main}12`,
                color: theme.palette.primary.main,
            },
        }),

        submoduleIcon: {
            fontSize: 19,
            marginRight: "10px",
        },

        submoduleText: {
            "& .MuiListItemText-primary": {
                fontSize: "0.88rem",
                fontWeight: 700,
                whiteSpace: "nowrap",
            },
        },

        optionsContainer: {
            marginTop: "5px",
            marginLeft: "18px",
        },

        optionButton: (isActive: boolean) => ({
            minHeight: 38,
            borderRadius: "10px",
            padding: "7px 10px",
            marginBottom: "4px",
            color: isActive
                ? theme.palette.primary.main
                : theme.palette.text.secondary,
            backgroundColor: isActive
                ? `${theme.palette.primary.main}16`
                : "transparent",
            transition: "all 0.2s ease",
            "&:hover": {
                backgroundColor: `${theme.palette.primary.main}12`,
                color: theme.palette.primary.main,
                transform: "translateX(4px)",
            },
        }),

        optionIcon: (isActive: boolean) => ({
            fontSize: 10,
            marginRight: "12px",
            color: isActive
                ? theme.palette.primary.main
                : theme.palette.text.disabled,
        }),

        optionText: (isActive: boolean) => ({
            "& .MuiListItemText-primary": {
                fontSize: "0.84rem",
                fontWeight: isActive ? 800 : 500,
                whiteSpace: "nowrap",
            },
        }),

        expandIcon: {
            fontSize: 22,
        },

        submoduleExpandIcon: {
            fontSize: 20,
        },
    };

    const toggleModule = (moduleName: string) => {
        setOpenModules((prev) => ({
            ...prev,
            [moduleName]: !prev[moduleName],
        }));
    };

    const toggleSubmodule = (submoduleKey: string) => {
        setOpenSubmodules((prev) => ({
            ...prev,
            [submoduleKey]: !prev[submoduleKey],
        }));
    };

    return (
        <Box sx={style.container}>

            <List sx={style.list}>
                {menuItems.map((module) => {
                    const isModuleOpen = openModules[module.module];

                    return (
                        <Box key={module.module} sx={style.moduleWrapper}>
                            <Tooltip
                                title={!openSidebar ? module.module : ""}
                                placement="right"
                                arrow
                            >
                                <ListItemButton
                                    onClick={() => toggleModule(module.module)}
                                    sx={style.moduleButton(isModuleOpen)}
                                >
                                    <Box sx={style.moduleIconBox}>
                                        {isModuleOpen ? (
                                            <FolderOpenIcon sx={{ fontSize: 22 }} />
                                        ) : (
                                            <FolderIcon sx={{ fontSize: 22 }} />
                                        )}
                                    </Box>

                                    {openSidebar && (
                                        <>
                                            <ListItemText
                                                primary={module.module}
                                                sx={style.moduleText}
                                            />

                                            {isModuleOpen ? (
                                                <ExpandLessIcon sx={style.expandIcon} />
                                            ) : (
                                                <ExpandMoreIcon sx={style.expandIcon} />
                                            )}
                                        </>
                                    )}
                                </ListItemButton>
                            </Tooltip>

                            <Collapse
                                in={openSidebar && isModuleOpen}
                                timeout="auto"
                                unmountOnExit
                            >
                                <Box sx={style.submodulesContainer}>
                                    {module.submodules.map((submodule) => {
                                        const submoduleKey = `${module.module}-${submodule.name}`;
                                        const isSubmoduleOpen = openSubmodules[submoduleKey];

                                        return (
                                            <Box
                                                key={submoduleKey}
                                                sx={style.submoduleWrapper}
                                            >
                                                <ListItemButton
                                                    onClick={() => toggleSubmodule(submoduleKey)}
                                                    sx={style.submoduleButton(isSubmoduleOpen)}
                                                >
                                                    <ArticleIcon sx={style.submoduleIcon} />

                                                    <ListItemText
                                                        primary={submodule.name}
                                                        sx={style.submoduleText}
                                                    />

                                                    {isSubmoduleOpen ? (
                                                        <ExpandLessIcon sx={style.submoduleExpandIcon} />
                                                    ) : (
                                                        <ExpandMoreIcon sx={style.submoduleExpandIcon} />
                                                    )}
                                                </ListItemButton>

                                                <Collapse
                                                    in={isSubmoduleOpen}
                                                    timeout="auto"
                                                    unmountOnExit
                                                >
                                                    <Box sx={style.optionsContainer}>
                                                        {submodule.options.map((option) => {
                                                            const isActive =
                                                                location.pathname === option.path;

                                                            return (
                                                                <ListItemButton
                                                                    key={option.path}
                                                                    onClick={() => navigate(option.path)}
                                                                    sx={style.optionButton(isActive)}
                                                                >
                                                                    <RadioButtonUncheckedIcon
                                                                        sx={style.optionIcon(isActive)}
                                                                    />

                                                                    <ListItemText
                                                                        primary={option.label}
                                                                        sx={style.optionText(isActive)}
                                                                    />
                                                                </ListItemButton>
                                                            );
                                                        })}
                                                    </Box>
                                                </Collapse>
                                            </Box>
                                        );
                                    })}
                                </Box>
                            </Collapse>
                        </Box>
                    );
                })}
            </List>
        </Box>
    );
};

export default SidebarMenu;